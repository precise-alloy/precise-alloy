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
const DIRECT_READ_PATH_MARKERS = ['abstracts', '_mixins', '_base', 'xpack'] as const;

if (!isWatch && fs.existsSync(outDir)) {
  fs.rmSync(outDir, { force: true, recursive: true });
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Something to use when events are received.
const log = console.log.bind(console);

const getCssSourceContent = (srcFile: string, mode: 'importer' | 'compile'): string[] => {
  if (mode === 'importer') {
    if (DIRECT_READ_PATH_MARKERS.some((marker) => srcFile.includes(marker))) {
      return [fs.readFileSync(srcFile, 'utf-8')];
    }

    if (srcFile.includes('mixins')) {
      return prepareCssFileContent({ srcFile, includeMixins: false });
    }

    return prepareCssFileContent({ srcFile });
  }

  if (srcFile.includes('xpack')) {
    return [fs.readFileSync(srcFile, 'utf-8')];
  }

  return prepareCssFileContent({ srcFile });
};

const stringOptions = (srcFile: string): sass.StringOptions<'async'> => {
  const options: sass.StringOptions<'async'> = {
    sourceMap: true,
    sourceMapIncludeSources: true,
    syntax: 'scss',
    style: 'compressed',
    url: pathToFileURL(path.resolve(srcFile)),
    importer: {
      canonicalize(url) {
        return new URL(url);
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
        cssStrings.push(
          sass.compileString(prepareCssFileContent({ srcFile: atomPath }).join(''), stringOptions(atomPath) as unknown as sass.StringOptions<'sync'>)
            .css
        );
      }
    });

    glob.sync('./src/molecules/**/*.scss').forEach((molPath) => {
      if (!path.basename(molPath).startsWith('_')) {
        cssStrings.push(
          sass.compileString(prepareCssFileContent({ srcFile: molPath }).join(''), stringOptions(molPath) as unknown as sass.StringOptions<'sync'>)
            .css
        );
      }
    });
  }

  sass
    .compileStringAsync(cssStrings.join(''), stringOptions(srcFile))
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
      fs.writeFileSync(path.join(outDir, to), postcssResult.css + (postcssResult.map ? `\n/*# sourceMappingURL=${to}.map */` : ''));

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
