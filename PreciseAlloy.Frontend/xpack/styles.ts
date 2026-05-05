/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { watch } from 'chokidar';
import * as sass from 'sass';
import slash from 'slash';
import debounce from 'debounce';
import { glob } from 'glob';
import browserslist from 'browserslist';
import { browserslistToTargets, transform as lightningTransform, type Targets } from 'lightningcss';
import { RawSourceMap } from 'source-map-js';

import {
  createScssImporterResult,
  getStyleWatchOptions,
  getStylesOutputFileName,
  prepareCssFileContent,
  sortStylePaths,
  stripInjectedPreludeFromSourceMap,
} from './styles-core';
import { rewriteAssetHashes } from './asset-hash';

const isWatch = process.argv.includes('--watch');
const outDir = './public/assets/css';

const SRC_ABSTRACTS_PREFIX = 'src/assets/styles/00-abstracts/';
const SRC_FUNCTIONS_PREFIX = 'src/assets/styles/01-functions/';
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

        return createScssImporterResult(filePath, getCssSourceContent(filePath, 'importer').join(''));
      },
    },
  };

  return options;
};

// Centralized failure reporter so silent rule drops or compile errors are
// always visible. In one-shot mode (`!isWatch`, used by CI / `bun styles`),
// any reported failure also flips `process.exitCode` to 1 so the build does
// not silently "succeed" — this is the missing safety net that previously
// let issues like `--navbar-max-width: px2rem(240px)` (Sass leaving a
// function call inside a CSS custom property value) ship through cssnano
// untouched. Watch mode keeps logging loudly but does not exit, so a typo
// while editing does not kill the dev process.
const reportStyleFailure = (file: string, kind: 'sass' | 'lightningcss-error' | 'lightningcss-warning', detail: unknown) => {
  log('\n[styles:FAIL]', kind, '-', file);
  log(detail);

  if (!isWatch) {
    process.exitCode = 1;
  }
};

// Track every in-flight compile promise so one-shot mode can `await` them
// before the script exits. Without this the script returns synchronously
// while compiles are still pending, which means a `reportStyleFailure()`
// call that fires AFTER Bun has already decided to exit cannot flip
// `process.exitCode` in time — the build appears to succeed even though
// rules were silently dropped. Watch mode does not need this because the
// process never exits.
const pendingCompiles = new Set<Promise<unknown>>();

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
    sortStylePaths(glob.sync('./src/atoms/**/*.scss')).forEach((atomPath) => {
      if (!path.basename(atomPath).startsWith('_')) {
        cssStrings.push(sass.compileString(prepareCssFileContent({ srcFile: atomPath }).join(''), getStringOptions<'sync'>(atomPath)).css);
      }
    });

    sortStylePaths(glob.sync('./src/molecules/**/*.scss')).forEach((molPath) => {
      if (!path.basename(molPath).startsWith('_')) {
        cssStrings.push(sass.compileString(prepareCssFileContent({ srcFile: molPath }).join(''), getStringOptions<'sync'>(molPath)).css);
      }
    });
  }

  const compilePromise = sass
    .compileStringAsync(cssStrings.join(''), getStringOptions<'async'>(srcFile))
    .then((result) => postcssProcess(result, srcFile, outFile))
    .catch((error) => {
      reportStyleFailure(srcFile, 'sass', error);
    });

  pendingCompiles.add(compilePromise);
  // Always remove the promise from the set, regardless of success/failure,
  // so the set does not grow unboundedly across watch-mode rebuilds.
  void compilePromise.finally(() => pendingCompiles.delete(compilePromise));
};

// Resolve the browser targets once at startup. lightningcss expects a
// `Targets` shape (numeric per-engine versions), and `browserslist()` reads
// `.browserslistrc` from the workspace root the same way autoprefixer used
// to. Computing this once avoids re-parsing browserslist on every CSS file.
//
// Note: if `.browserslistrc` changes, the watch process needs a restart for
// the new targets to take effect (the targets are captured in a module-level
// constant). This matches the previous autoprefixer behavior, which also
// snapshotted browserslist data per-process.
const lightningTargets: Targets = browserslistToTargets(browserslist());

const postcssProcess = (result: sass.CompileResult, from: string, to: string) => {
  // Adjust the Sass source map to point at the original component files (not
  // the prelude-injected versions) before handing it to lightningcss. Without
  // this step, line numbers in DevTools would be off by the number of
  // injected `@use` lines.
  const inputMap = stripInjectedPreludeFromSourceMap(result.sourceMap as RawSourceMap);

  // lightningcss replaces the previous PostCSS plugin chain
  // (`autoprefixer({ grid: true })` + `cssnano`):
  //   - `targets` derived from `.browserslistrc` covers vendor prefixing,
  //     including the legacy IE grid syntax that `autoprefixer({ grid: true })`
  //     used to handle.
  //   - `minify: true` performs the same kind of whitespace/identifier/rule
  //     compression cssnano did, in a single Rust pass.
  // `inputSourceMap` chains the Sass source map so DevTools can map minified
  // CSS back to the original SCSS files; the resulting `map` Buffer is
  // written next to the CSS as `<file>.css.map`, mirroring the prior layout.
  let output;

  // Strip a leading UTF-8 BOM (`\uFEFF`) that Sass prepends to its compressed
  // output. lightningcss treats the BOM as an invalid token and silently
  // drops the entire first CSS rule (with `errorRecovery: true`) or throws
  // (without it). cssnano tolerated the BOM, which is why the previous
  // pipeline never tripped on this. Removing the BOM is safe because the
  // file is then re-emitted by lightningcss without one and we only need
  // one BOM at the very start of the final concatenated CSS at most — which
  // we don't add either, matching the previous output.
  const cssInput = result.css.charCodeAt(0) === 0xfeff ? result.css.slice(1) : result.css;

  try {
    output = lightningTransform({
      filename: from,
      code: Buffer.from(cssInput),
      minify: true,
      sourceMap: true,
      inputSourceMap: JSON.stringify(inputMap),
      targets: lightningTargets,
      // We intentionally enable `errorRecovery` so a single bad rule does
      // not blank out the whole stylesheet — but we treat any recovered
      // warning as a hard failure via `reportStyleFailure` below. lightningcss
      // is stricter than cssnano (it rejects e.g. unknown function calls
      // like `px2rem(240px)` left unevaluated by Sass inside CSS custom
      // property values, or non-spec pseudo-class chains after a
      // pseudo-element). Surfacing those as build failures forces them to
      // be fixed in the source instead of being silently dropped.
      errorRecovery: true,
    });
  } catch (error) {
    reportStyleFailure(from, 'lightningcss-error', error);

    return;
  }

  if (output.warnings && output.warnings.length > 0) {
    output.warnings.forEach((warning) => {
      reportStyleFailure(from, 'lightningcss-warning', warning);
    });
  }

  // Append `?v=<hash>` to every `/assets/...` URL in the final CSS so
  // browsers cache-bust whenever a referenced font/image changes. This
  // mirrors the JS/TS pipeline in `xpack/hooks/transform.ts` and shares
  // the same regex + hash cache through `asset-hash.ts`.
  //
  // lightningcss returns `code`/`map` as `Uint8Array`, not Node Buffer, so
  // we wrap with `Buffer.from()` to get the encoding-aware `.toString()`.
  const hashedCss = rewriteAssetHashes(Buffer.from(output.code).toString('utf-8'));
  const mapString = output.map ? Buffer.from(output.map).toString('utf-8') : undefined;

  // Detect Sass functions that survived into the compiled CSS. lightningcss
  // intentionally allows arbitrary tokens inside CSS custom property values
  // (`--foo: anything;`), so calls like `--navbar-max-width: px2rem(240px);`
  // pass through silently when the author forgot to wrap them in `#{...}`
  // interpolation. The result reaches the browser as the literal string
  // `px2rem(240px)`, which is invalid CSS at runtime. Scan the final CSS for
  // every project-defined Sass function name and fail the build if any
  // remain — this is the safety net that catches the original px2rem
  // regression class. The list mirrors `@function` declarations under
  // `src/assets/styles/01-functions/`. If a new SCSS function is added
  // there, append it here too.
  const SCSS_FUNCTION_LEAK_PATTERN = /\b(?:px2rem|px2em|rtl|str-replace|div)\(/g;
  const leaks = hashedCss.match(SCSS_FUNCTION_LEAK_PATTERN);

  if (leaks && leaks.length > 0) {
    reportStyleFailure(from, 'lightningcss-warning', `unevaluated SCSS function(s) leaked into output: ${[...new Set(leaks)].join(', ')}`);
  }

  fs.writeFileSync(path.join(outDir, to), hashedCss + (mapString ? `\n/*# sourceMappingURL=${to}.map */` : ''));

  if (mapString) {
    fs.writeFileSync(path.join(outDir, to + '.map'), mapString);
  }
};

const styleOrganisms = debounce((isReady: boolean) => {
  const paths = sortStylePaths(glob.sync('src/organisms/**/*.scss', { nodir: true }));

  paths.forEach((p) => styleOrganism(p, isReady));
}, DEBOUNCE_DELAY_MS);

const styleTemplates = debounce((isReady: boolean) => {
  const paths = sortStylePaths(glob.sync('src/templates/**/*.scss', { nodir: true }));

  paths.forEach((p) => styleTemplate(p, isReady));
}, DEBOUNCE_DELAY_MS);

const styleBase = debounce((isReady: boolean) => compile('src/assets/styles/style-base.scss', { isReady }), DEBOUNCE_DELAY_MS);
const stylePlState = debounce((isReady: boolean) => compile('xpack/styles/pl-states.scss', { isReady }), DEBOUNCE_DELAY_MS);
const styleRoot = debounce((isReady: boolean) => compile('xpack/styles/root.scss', { isReady }), DEBOUNCE_DELAY_MS);
const styleOrganism = (srcFile: string, isReady: boolean) => compile(srcFile, { prefix: ORGANISM_PREFIX, isReady });
const styleTemplate = (srcFile: string, isReady: boolean) => compile(srcFile, { prefix: TEMPLATE_PREFIX, isReady });

const sassCompile = (inputPath: string, isReady: boolean) => {
  const p = slash(inputPath);

  if (p.startsWith(SRC_ABSTRACTS_PREFIX) || p.startsWith(SRC_FUNCTIONS_PREFIX) || p.startsWith(SRC_MIXINS_PREFIX)) {
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
      sortStylePaths(glob.sync(path.dirname(p) + '/*.scss', { nodir: true }))
        .filter((f) => !path.basename(f).startsWith('_'))
        .forEach((f) => styleOrganism(f, isReady));
    } else {
      styleOrganism(p, isReady);
    }
  }

  if (p.startsWith(SRC_TEMPLATES_PREFIX)) {
    if (path.basename(p).startsWith('_')) {
      sortStylePaths(glob.sync(path.dirname(p) + '/*.scss', { nodir: true }))
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
  const watcher = watch(['src', 'xpack/styles'], getStyleWatchOptions());
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

  sortStylePaths(glob.sync(['src/{organisms,templates}/**/*.scss', 'xpack/styles/**/*.scss']))
    .filter((f) => !path.basename(f).startsWith('_'))
    .forEach((f) => sassCompile(f, true));

  // Drain every pending compile before exiting so `reportStyleFailure()`
  // calls reliably set `process.exitCode` BEFORE Bun terminates. Without
  // this drain the script returns synchronously, the failures fire late,
  // and the exit code is racy (0 vs. 1 across consecutive runs).
  //
  // The compile entry points are debounced, so we wait one debounce tick
  // first to let the queued debounced calls actually invoke `compile()` and
  // populate `pendingCompiles`. After that, we keep draining in a loop
  // because earlier compiles can asynchronously schedule further work
  // (e.g. `style-base` aggregates atom/molecule sub-compiles).
  setTimeout(async () => {
    while (pendingCompiles.size > 0) {
      await Promise.allSettled([...pendingCompiles]);
    }
  }, DEBOUNCE_DELAY_MS + 50);
}

// Ensure this file is treated as a module
export {};
