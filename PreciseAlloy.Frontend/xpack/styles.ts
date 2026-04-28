/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { watch } from 'chokidar';
import * as sass from 'sass';
import slash from 'slash';
import debounce from 'debounce';
import { glob } from 'glob';
import postcss, { ProcessOptions } from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { RawSourceMap } from 'source-map-js';

import { getStylesOutputFileName, prepareCssFileContent, stripInjectedPreludeFromSourceMap } from './styles-core';
import { rewriteAssetHashes } from './asset-hash';

const isWatch = process.argv.includes('--watch');
const outDir = './public/assets/css';

const SRC_ABSTRACTS_PREFIX = 'src/assets/styles/00-abstracts/';
const SRC_MIXINS_PREFIX = 'src/assets/styles/01-mixins/';
const SRC_ATOMS_PREFIX = 'src/atoms';
const SRC_MOLECULES_PREFIX = 'src/molecules';
const SRC_BASE_PREFIX = 'src/assets/styles/02-base';
const SRC_ORGANISMS_PREFIX = 'src/organisms';
const SRC_TEMPLATES_PREFIX = 'src/templates';
const XPACK_PL_STATES_PREFIX = 'xpack/styles/pl-states';
const XPACK_STYLES_PREFIX = 'xpack/styles';
const DEBOUNCE_DELAY_MS = 200;
const ORGANISM_PREFIX = 'b-';
const TEMPLATE_PREFIX = 'p-';
// Path-segment markers (slash-bounded) used to decide which prelude pieces
// to inject when an importer load lands on a particular file. We intentionally
// match by `/segment/` instead of bare `substring` because a naive
// `srcFile.includes('_base')` check would also match unrelated component
// partials like `_base-header.scss` or `_base-style.scss`, silently dropping
// their prelude and producing "Undefined mixin" errors at compile time.
//
// Each matcher accepts both absolute (`/.../xpack/...`) and relative
// (`xpack/...`) inputs because `compile()` is called with workspace-relative
// paths while the Sass importer hands us absolute `file://` paths.
const matchesPathSegment = (slashed: string, segment: string) => slashed.includes(`/${segment}/`) || slashed.startsWith(`${segment}/`);
const matchesPathSuffix = (slashed: string, suffix: string) => slashed.endsWith(`/${suffix}`) || slashed === suffix;

const ABSTRACTS_DIR = 'src/assets/styles/00-abstracts';
const MIXINS_DIR = 'src/assets/styles/01-mixins';
const FUNCTIONS_DIR = 'src/assets/styles/01-functions';
const BASE_DIR = 'src/assets/styles/02-base';
const XPACK_DIR = 'xpack';
// Barrel files that just `@forward` their siblings — injecting a prelude that
// `@use`s the same barrel would recurse forever.
const MIXINS_BARREL = `${MIXINS_DIR}/_mixins.scss`;
const FUNCTIONS_BARREL = `${FUNCTIONS_DIR}/_functions.scss`;
const BASE_BARREL = `${BASE_DIR}/_base.scss`;

if (!isWatch && fs.existsSync(outDir)) {
  fs.rmSync(outDir, { force: true, recursive: true });
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Something to use when events are received.
const log = console.log.bind(console);

const getCssSourceContent = (srcFile: string, mode: 'importer' | 'compile'): string[] => {
  const slashed = slash(srcFile);

  if (mode === 'importer') {
    // Abstract leaves (variables, colors, etc.) and the abstracts barrel
    // don't depend on anything; they ARE the abstracts. The same applies to
    // xpack stylesheets, which manage their own `@use` graph and should not
    // see any of the component-tree preludes.
    if (matchesPathSegment(slashed, ABSTRACTS_DIR) || matchesPathSegment(slashed, XPACK_DIR)) {
      return [fs.readFileSync(srcFile, 'utf-8')];
    }

    // Mixins barrel only `@forward`s siblings; injecting the mixins prelude
    // here would recurse. Mixin partials themselves (e.g. `_borders.scss`)
    // reference abstract variables and helpers like `px2rem`, so they get
    // the abstracts + functions preludes but NOT the mixins one.
    if (matchesPathSuffix(slashed, MIXINS_BARREL)) {
      return [fs.readFileSync(srcFile, 'utf-8')];
    }

    if (matchesPathSegment(slashed, MIXINS_DIR)) {
      return prepareCssFileContent({ srcFile, includeMixins: false });
    }

    // Functions barrel: same self-recursion concern as the mixins barrel.
    if (matchesPathSuffix(slashed, FUNCTIONS_BARREL)) {
      return [fs.readFileSync(srcFile, 'utf-8')];
    }

    // Function partials reference abstract variables (`$rem`, `$rtl-sign`)
    // but cannot pull in either the functions barrel (self-recurse) or the
    // mixins barrel (mixins depend on functions, would recurse the other way).
    if (matchesPathSegment(slashed, FUNCTIONS_DIR)) {
      return prepareCssFileContent({ srcFile, includeMixins: false, includeFunctions: false });
    }

    // The `_base.scss` barrel only `@use`s its siblings; the base partials
    // themselves use the full prelude and fall through to the default branch.
    if (matchesPathSuffix(slashed, BASE_BARREL)) {
      return [fs.readFileSync(srcFile, 'utf-8')];
    }

    return prepareCssFileContent({ srcFile });
  }

  // Compile mode: xpack entry stylesheets manage their own imports.
  if (matchesPathSegment(slashed, XPACK_DIR)) {
    return [fs.readFileSync(srcFile, 'utf-8')];
  }

  return prepareCssFileContent({ srcFile });
};

const getStringOptions = <Sync extends 'sync' | 'async'>(srcFile: string): sass.StringOptions<Sync> => {
  const options: sass.StringOptions<Sync> = {
    sourceMap: true,
    sourceMapIncludeSources: true,
    syntax: 'scss',
    style: 'compressed',
    url: pathToFileURL(path.resolve(srcFile)),
    importer: {
      // Resolve every `@use`/`@forward` URL to a `file://` canonical URL so
      // our `load()` always runs and gets to inject the abstracts/functions/
      // mixins preludes. The previous `new URL(url)` form threw on relative
      // specifiers like `@use 'sibling'`; Sass would catch the throw and fall
      // back to its built-in file-system loader, which bypasses our `load()`
      // entirely. The result was that partials silently lost access to all
      // globally-injected mixins/functions and produced "Undefined mixin"
      // errors at first use.
      canonicalize(url, context) {
        try {
          return new URL(url);
        } catch {
          if (context?.containingUrl) {
            try {
              return new URL(url, context.containingUrl);
            } catch {
              return null;
            }
          }

          return null;
        }
      },
      load(canonicalUrl: URL) {
        let filePath = fileURLToPath(canonicalUrl);

        if (!filePath.endsWith('.scss')) {
          const parentDir = path.dirname(filePath);
          const fileName = path.basename(filePath);

          filePath = path.join(parentDir, fileName + '.scss');

          if (!fs.existsSync(filePath)) {
            filePath = path.join(parentDir, '_' + fileName + '.scss');
          }
        }

        if (!fs.existsSync(filePath)) return null;

        return {
          contents: getCssSourceContent(filePath, 'importer').join(''),
          syntax: 'scss',
        };
      },
    },
  };

  return options;
};

const compile = (srcFile: string, options: { prefix?: string; isReady: boolean }) => {
  if (options.isReady) {
    log('compile:', slash(srcFile));
  }

  if (path.basename(srcFile).startsWith('_')) {
    return;
  }

  const name =
    path.basename(srcFile) === 'index.scss' ? path.basename(path.dirname(srcFile)) + '.css' : path.basename(srcFile).replace(/\.scss$/, '.css');

  const outFile = (options.prefix ?? '') + name;

  const cssStrings = getCssSourceContent(srcFile, 'compile');

  if (srcFile.includes('style-base') || srcFile.includes('style-all')) {
    glob.sync('./src/atoms/**/*.scss').forEach((atomPath) => {
      if (!path.basename(atomPath).startsWith('_')) {
        cssStrings.push(sass.compileString(prepareCssFileContent({ srcFile: atomPath }).join(''), getStringOptions<'sync'>(atomPath)).css);
      }
    });

    glob.sync('./src/molecules/**/*.scss').forEach((molPath) => {
      if (!path.basename(molPath).startsWith('_')) {
        cssStrings.push(sass.compileString(prepareCssFileContent({ srcFile: molPath }).join(''), getStringOptions<'sync'>(molPath)).css);
      }
    });
  }

  sass
    .compileStringAsync(cssStrings.join(''), getStringOptions<'async'>(srcFile))
    .then((result) => postcssProcess(result, srcFile, outFile))
    .catch((error) => {
      log(error);
    });
};

const postcssProcess = (result: sass.CompileResult, from: string, to: string) => {
  const postcssOptions: ProcessOptions = {
    from: pathToFileURL(from).href,
    to,
    map: { prev: stripInjectedPreludeFromSourceMap(result.sourceMap as RawSourceMap), absolute: false },
  };

  postcss([autoprefixer({ grid: true }), cssnano])
    .process(result.css, postcssOptions)
    .then((postcssResult) => {
      // Append `?v=<hash>` to every `/assets/...` URL in the final CSS so
      // browsers cache-bust whenever a referenced font/image changes. This
      // mirrors the JS/TS pipeline in `xpack/hooks/transform.ts` and shares
      // the same regex + hash cache through `asset-hash.ts`.
      const hashedCss = rewriteAssetHashes(postcssResult.css);

      fs.writeFileSync(path.join(outDir, to), hashedCss + (postcssResult.map ? `\n/*# sourceMappingURL=${to}.map */` : ''));

      if (postcssResult.map) {
        fs.writeFileSync(path.join(outDir, to + '.map'), postcssResult.map.toString());
      }
    })
    .catch((error) => {
      log('PostCSS error:', error);
    });
};

const styleOrganisms = debounce((isReady: boolean) => {
  const paths = glob.sync('src/organisms/**/*.scss', { nodir: true });

  paths.forEach((p) => styleOrganism(p, isReady));
}, DEBOUNCE_DELAY_MS);

const styleTemplates = debounce((isReady: boolean) => {
  const paths = glob.sync('src/templates/**/*.scss', { nodir: true });

  paths.forEach((p) => styleTemplate(p, isReady));
}, DEBOUNCE_DELAY_MS);

const styleBase = debounce((isReady: boolean) => compile('src/assets/styles/style-base.scss', { isReady }), DEBOUNCE_DELAY_MS);
const stylePlState = debounce((isReady: boolean) => compile('xpack/styles/pl-states.scss', { isReady }), DEBOUNCE_DELAY_MS);
const styleRoot = debounce((isReady: boolean) => compile('xpack/styles/root.scss', { isReady }), DEBOUNCE_DELAY_MS);
const styleOrganism = (srcFile: string, isReady: boolean) => compile(srcFile, { prefix: ORGANISM_PREFIX, isReady });
const styleTemplate = (srcFile: string, isReady: boolean) => compile(srcFile, { prefix: TEMPLATE_PREFIX, isReady });

const sassCompile = (inputPath: string, isReady: boolean) => {
  const p = slash(inputPath);

  if (p.startsWith(SRC_ABSTRACTS_PREFIX) || p.startsWith(SRC_MIXINS_PREFIX)) {
    styleBase(isReady);
    styleOrganisms(isReady);
    styleTemplates(isReady);
    stylePlState(isReady);
  }

  if (p.startsWith(SRC_ATOMS_PREFIX) || p.startsWith(SRC_MOLECULES_PREFIX) || p.startsWith(SRC_BASE_PREFIX)) {
    styleBase(isReady);
  }

  if (p.startsWith(SRC_ORGANISMS_PREFIX)) {
    if (path.basename(p).startsWith('_')) {
      glob
        .sync(path.dirname(p) + '/*.scss', { nodir: true })
        .filter((f) => !path.basename(f).startsWith('_'))
        .forEach((f) => styleOrganism(f, isReady));
    } else {
      styleOrganism(p, isReady);
    }
  }

  if (p.startsWith(SRC_TEMPLATES_PREFIX)) {
    if (path.basename(p).startsWith('_')) {
      glob
        .sync(path.dirname(p) + '/*.scss', { nodir: true })
        .filter((f) => !path.basename(f).startsWith('_'))
        .forEach((f) => styleTemplate(f, isReady));
    } else {
      styleTemplate(p, isReady);
    }
  }

  if (p.startsWith(XPACK_PL_STATES_PREFIX)) {
    stylePlState(isReady);
  } else if (p.startsWith(XPACK_STYLES_PREFIX)) {
    styleRoot(isReady);
  }
};

const getOutFileName = (srcFile: string): string | undefined => {
  return getStylesOutputFileName(srcFile, { organismPrefix: ORGANISM_PREFIX, templatePrefix: TEMPLATE_PREFIX });
};

const cleanUpOutput = (srcFile: string) => {
  const outFile = getOutFileName(srcFile);

  if (!outFile) return;

  const cssPath = path.join(outDir, outFile);
  const mapPath = cssPath + '.map';

  if (fs.existsSync(cssPath)) fs.unlinkSync(cssPath);
  if (fs.existsSync(mapPath)) fs.unlinkSync(mapPath);
};

if (isWatch) {
  const watcher = watch(['src', 'xpack/styles'], { ignored: (f, stats) => !!stats?.isFile() && !f.endsWith('.scss') });
  let isReady = false;

  watcher
    .on('ready', () => {
      log('SCSS ready!');
      isReady = true;
    })
    .on('add', (f) => sassCompile(f, isReady))
    .on('change', (f) => sassCompile(f, isReady))
    .on('unlink', (f) => {
      log(`File ${f} has been removed`);
      cleanUpOutput(f);
    });
} else {
  styleBase(true);
  stylePlState(true);

  glob
    .sync(['src/{organisms,templates}/**/*.scss', 'xpack/styles/**/*.scss'])
    .filter((f) => !path.basename(f).startsWith('_'))
    .forEach((f) => sassCompile(f, true));
}

// Ensure this file is treated as a module
export {};
