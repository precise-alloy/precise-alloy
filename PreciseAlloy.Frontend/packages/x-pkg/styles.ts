import fs from 'fs';
import chokidar from 'chokidar';
import * as sass from 'sass';
import slash from 'slash';
import debounce from 'debounce';
import path from 'path';
import { glob } from 'glob';
import postcss, { ProcessOptions } from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import _ from 'lodash';
import { pathToFileURL } from 'url';

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

const stringOptions = (srcFile: string): sass.StringOptionsWithoutImporter<'sync' | 'async'> => {
  const options: sass.StringOptionsWithoutImporter<'sync' | 'async'> = {
    sourceMap: true,
    sourceMapIncludeSources: true,
    syntax: 'scss',
    style: 'compressed',
    url: pathToFileURL(path.resolve(srcFile)),
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

  const outFile = `${options.prefix ?? ''}${path
    .basename(srcFile)
    .replaceAll(/^(\w+)/gi, (_p0, p1: string) =>
      _.lowerCase(
        p1.replaceAll(/(b2c|eshop)/gi, (_m0, m1: string) => {
          return m1.toLowerCase();
        })
      ).replaceAll(' ', '-')
    )
    .replace(/\.scss$/gi, '.css')}`;

  const srcCss: string[] = [
    slash(`@import '${path.relative(path.dirname(srcFile), path.resolve('../../src/assets/styles/00-abstracts/abstracts'))}';`),
    slash(`@import '${path.relative(path.dirname(srcFile), path.resolve('../../src/assets/styles/01-mixins/mixins'))}';`),
    fs.readFileSync(srcFile, 'utf-8'),
  ];

  if (srcFile.includes('style-base') || srcFile.includes('style-all')) {
    glob.sync('../../src/atoms/**/*.scss').forEach((a) => {
      if (path.basename(a).startsWith('_')) {
        return;
      }

      const relativePath = slash(path.relative(path.dirname(srcFile), a)).replace(/\.scss$/i, '');

      srcCss.push(`@import "${relativePath}";`);
    });

    glob.sync('../../src/molecules/**/*.scss').forEach((a) => {
      if (path.basename(a).startsWith('_')) {
        return;
      }

      const relativePath = slash(path.relative(path.dirname(srcFile), a)).replace(/\.scss$/i, '');

      srcCss.push(`@import "${relativePath}";`);
    });
  }

  sass
    .compileStringAsync(srcCss.join(''), stringOptions(srcFile))
    .then((result) => postcssProcess(result, srcFile, outFile))
    .catch((error) => {
      log(error);
    });
};

const postcssProcess = (result: sass.CompileResult, from: string, to: string) => {
  const postcssOptions: ProcessOptions = {
    from: pathToFileURL(from).href,
    to,
    map: {
      prev: result.sourceMap,
      absolute: false,
    },
  };

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
  const paths = glob.sync('../../src/organisms/**/*.scss', { nodir: true });
  [].forEach.call(paths, (p: string) => styleOrganism(p, isReady));
}, 200);

const styleTemplates = debounce((isReady: boolean) => {
  const paths = glob.sync('../../src/templates/**/*.scss', { nodir: true });
  [].forEach.call(paths, (p: string) => styleTemplate(p, isReady));
}, 200);

const styleBase = debounce((isReady: boolean) => compile('../../src/assets/styles/style-base.scss', { isReady }), 200);
const stylePlState = debounce((isReady: boolean) => compile('xpack/styles/pl-states.scss', { isReady }), 200);
const styleRoot = debounce((isReady: boolean) => compile('xpack/styles/root.scss', { isReady }), 200);
const styleOrganism = (srcFile: string, isReady: boolean) => compile(srcFile, { prefix: 'b-', isReady });
const styleTemplate = (srcFile: string, isReady: boolean) => compile(srcFile, { prefix: 'p-', isReady });

const sassCompile = (inputPath: string, isReady: boolean) => {
  const p = slash(inputPath);

  if (p.includes('src/assets/styles/00-abstracts/') || p.includes('src/assets/styles/01-mixins/')) {
    styleBase(isReady);
    styleOrganisms(isReady);
    styleTemplates(isReady);
    stylePlState(isReady);
  }

  if (p.includes('src/atoms') || p.includes('src/molecules') || p.includes('src/assets/styles/02-base')) {
    styleBase(isReady);
  }

  if (p.includes('src/organisms')) {
    if (path.basename(p).startsWith('_')) {
      glob
        .sync(path.dirname(p) + '/*.scss', { nodir: true })
        .filter((p) => !path.basename(p).startsWith('_'))
        .forEach((p) => styleOrganism(p, isReady));
    } else {
      styleOrganism(p, isReady);
    }
  }

  if (p.includes('src/templates')) {
    if (path.basename(p).startsWith('_')) {
      glob
        .sync(path.dirname(p) + '/*.scss', { nodir: true })
        .filter((p) => !path.basename(p).startsWith('_'))
        .forEach((p) => styleTemplate(p, isReady));
    } else {
      styleTemplate(p, isReady);
    }
  }

  if (p.includes('xpack/styles/pl-states')) {
    stylePlState(isReady);
  } else if (p.includes('xpack/styles')) {
    styleRoot(isReady);
  }
};

if (isWatch) {
  const watcher = chokidar.watch(['src/**/*.scss', 'xpack/styles/**/*.scss', '../../src/**/*.scss']);
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
    .sync(['../../src/{organisms,templates}/**/*.scss', 'xpack/styles/**/*.scss'])
    .filter((p) => !path.basename(p).startsWith('_'))
    .forEach((path) => sassCompile(path, true));
}

export { };
