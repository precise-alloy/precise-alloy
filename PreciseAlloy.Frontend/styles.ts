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

const isWatch = process.argv.includes('--watch');
const outDir = './public/assets/css';

if (!isWatch && fs.existsSync(outDir)) {
  fs.rmSync(outDir, { force: true, recursive: true });
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Something to use when events are received.
const log = console.log.bind(console);

const prepareCssFileContent = ({
  srcFile,
  includeMixins = true,
  includeAbstracts = true,
}: {
  srcFile: string;
  includeMixins?: boolean;
  includeAbstracts?: boolean;
}) => {
  return [
    includeAbstracts
      ? slash(`@use '${path.relative(path.dirname(srcFile), path.resolve('src/assets/styles/00-abstracts/abstracts'))}' as *;\n`)
      : undefined,
    includeMixins ? slash(`@use '${path.relative(path.dirname(srcFile), path.resolve('src/assets/styles/01-mixins/mixins'))}' as *;\n`) : undefined,
    fs.readFileSync(srcFile, 'utf-8'),
  ].filter(Boolean);
};

const stringOptions = (srcFile: string): sass.StringOptions<'sync' | 'async'> => {
  const options: sass.StringOptions<'sync' | 'async'> = {
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

        if (filePath.includes('abstracts') || filePath.includes('_mixins') || filePath.includes('_base') || filePath.includes('xpack'))
          return {
            contents: fs.readFileSync(filePath, 'utf-8'),
            syntax: 'scss',
          };

        let content = prepareCssFileContent({ srcFile: filePath });

        if (filePath.includes('mixins')) {
          content = prepareCssFileContent({ srcFile: filePath, includeMixins: false });
        }

        return {
          contents: content.join(''),
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
    path.basename(srcFile) === 'index.scss' ? path.basename(path.dirname(srcFile)) + '.css' : path.basename(srcFile).replace(/\.scss$/gi, '.css');

  const outFile = (options.prefix ?? '') + name;

  const cssStrings = srcFile.includes('xpack') ? [fs.readFileSync(srcFile, 'utf-8')] : prepareCssFileContent({ srcFile });

  if (srcFile.includes('style-base') || srcFile.includes('style-all')) {
    glob.sync('./src/atoms/**/*.scss').forEach((atomPath) => {
      if (!path.basename(atomPath).startsWith('_')) {
        cssStrings.push(sass.compileString(prepareCssFileContent({ srcFile: atomPath }).join(''), stringOptions(atomPath)).css);
      }
    });

    glob.sync('./src/molecules/**/*.scss').forEach((molPath) => {
      if (!path.basename(molPath).startsWith('_')) {
        cssStrings.push(sass.compileString(prepareCssFileContent({ srcFile: molPath }).join(''), stringOptions(molPath)).css);
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
  const postcssOptions: ProcessOptions = { from: pathToFileURL(from).href, to, map: { prev: result.sourceMap, absolute: false } };

  postcss([autoprefixer({ grid: true }), cssnano])
    .process(result.css, postcssOptions)
    .then((result) => {
      fs.writeFileSync(path.join(outDir, to), result.css + (result.map ? `\n/*# sourceMappingURL=${to}.map */` : ''));

      if (result.map) {
        fs.writeFileSync(path.join(outDir, to + '.map'), result.map.toString());
      }
    });
};

const styleOrganisms = debounce((isReady: boolean) => {
  const paths = glob.sync('src/organisms/**/*.scss', { nodir: true });

  [].forEach.call(paths, (p: string) => styleOrganism(p, isReady));
}, 200);

const styleTemplates = debounce((isReady: boolean) => {
  const paths = glob.sync('src/templates/**/*.scss', { nodir: true });

  [].forEach.call(paths, (p: string) => styleTemplate(p, isReady));
}, 200);

const styleBase = debounce((isReady: boolean) => compile('src/assets/styles/style-base.scss', { isReady }), 200);
const stylePlState = debounce((isReady: boolean) => compile('xpack/styles/pl-states.scss', { isReady }), 200);
const styleRoot = debounce((isReady: boolean) => compile('xpack/styles/root.scss', { isReady }), 200);
const styleOrganism = (srcFile: string, isReady: boolean) => compile(srcFile, { prefix: 'b-', isReady });
const styleTemplate = (srcFile: string, isReady: boolean) => compile(srcFile, { prefix: 'p-', isReady });

const sassCompile = (inputPath: string, isReady: boolean) => {
  const p = slash(inputPath);

  if (p.startsWith('src/assets/styles/00-abstracts/') || p.startsWith('src/assets/styles/01-mixins/')) {
    styleBase(isReady);
    styleOrganisms(isReady);
    styleTemplates(isReady);
    stylePlState(isReady);
  }

  if (p.startsWith('src/atoms') || p.startsWith('src/molecules') || p.startsWith('src/assets/styles/02-base')) {
    styleBase(isReady);
  }

  if (p.startsWith('src/organisms')) {
    if (path.basename(p).startsWith('_')) {
      glob
        .sync(path.dirname(p) + '/*.scss', { nodir: true })
        .filter((p) => !path.basename(p).startsWith('_'))
        .forEach((p) => styleOrganism(p, isReady));
    } else {
      styleOrganism(p, isReady);
    }
  }

  if (p.startsWith('src/templates')) {
    if (path.basename(p).startsWith('_')) {
      glob
        .sync(path.dirname(p) + '/*.scss', { nodir: true })
        .filter((p) => !path.basename(p).startsWith('_'))
        .forEach((p) => styleTemplate(p, isReady));
    } else {
      styleTemplate(p, isReady);
    }
  }

  if (p.startsWith('xpack/styles/pl-states')) {
    stylePlState(isReady);
  } else if (p.startsWith('xpack/styles')) {
    styleRoot(isReady);
  }
};

if (isWatch) {
  const watcher = watch(['src', 'xpack/styles'], { ignored: (path, stats) => !!stats?.isFile() && !path.endsWith('.scss') });
  let isReady = false;

  watcher
    .on('ready', () => {
      log('SCSS ready!');
      isReady = true;
    })
    .on('add', (path) => sassCompile(path, isReady))
    .on('change', (path) => sassCompile(path, isReady))
    .on('unlink', (path) => log(`File ${path} has been removed`));
} else {
  styleBase(true);
  stylePlState(true);

  glob
    .sync(['src/{organisms,templates}/**/*.scss', 'xpack/styles/**/*.scss'])
    .filter((p) => !path.basename(p).startsWith('_'))
    .forEach((path) => sassCompile(path, true));
}

export {};
