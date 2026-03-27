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
import { RawSourceMap, SourceMapConsumer, SourceMapGenerator } from 'source-map-js';

const isWatch = process.argv.includes('--watch');
const outDir = './public/assets/css';
const ORGANISM_PREFIX = 'b-';
const TEMPLATE_PREFIX = 'p-';

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

const resolveSourceMapPath = (source: string, sourceRoot?: string | null): string | undefined => {
  if (source.startsWith('data:')) {
    return undefined;
  }

  try {
    if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(source)) {
      return fileURLToPath(new URL(source));
    }

    if (sourceRoot && /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(sourceRoot)) {
      return fileURLToPath(new URL(source, sourceRoot));
    }
  } catch {
    return undefined;
  }

  return path.resolve(sourceRoot ?? '.', source);
};

const stripInjectedPreludeFromSourceMap = (sourceMap: RawSourceMap): RawSourceMap => {
  const consumer = new SourceMapConsumer(sourceMap);
  const generator = new SourceMapGenerator({
    file: sourceMap.file,
    sourceRoot: sourceMap.sourceRoot,
  });
  const sourceLineOffsets = new Map<string, number>();

  consumer.sources.forEach((source) => {
    const sourceContent = consumer.sourceContentFor(source, true);
    const filePath = resolveSourceMapPath(source, consumer.sourceRoot);

    if (!filePath || !sourceContent || !fs.existsSync(filePath)) {
      generator.setSourceContent(source, sourceContent ?? undefined);

      return;
    }

    const realSourceContent = fs.readFileSync(filePath, 'utf-8');

    if (!sourceContent.endsWith(realSourceContent)) {
      generator.setSourceContent(source, sourceContent);

      return;
    }

    const injectedPrelude = sourceContent.slice(0, sourceContent.length - realSourceContent.length);
    const lineOffset = injectedPrelude.match(/\n/g)?.length ?? 0;

    if (lineOffset > 0) {
      sourceLineOffsets.set(source, lineOffset);
    }

    generator.setSourceContent(source, realSourceContent);
  });

  consumer.eachMapping((mapping) => {
    const generated = {
      line: mapping.generatedLine,
      column: mapping.generatedColumn,
    };

    if (!mapping.source || mapping.originalLine == null || mapping.originalColumn == null) {
      generator.addMapping({
        generated,
        name: mapping.name ?? undefined,
      });

      return;
    }

    const lineOffset = sourceLineOffsets.get(mapping.source) ?? 0;
    const originalLine = mapping.originalLine - lineOffset;

    if (originalLine < 1) {
      return;
    }

    generator.addMapping({
      generated,
      original: {
        line: originalLine,
        column: mapping.originalColumn,
      },
      source: mapping.source,
      name: mapping.name ?? undefined,
    });
  });

  return generator.toJSON();
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
    path.basename(srcFile) === 'index.scss' ? path.basename(path.dirname(srcFile)) + '.css' : path.basename(srcFile).replace(/\.scss$/, '.css');

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
}, 200);

const styleTemplates = debounce((isReady: boolean) => {
  const paths = glob.sync('src/templates/**/*.scss', { nodir: true });

  paths.forEach((p) => styleTemplate(p, isReady));
}, 200);

const styleBase = debounce((isReady: boolean) => compile('src/assets/styles/style-base.scss', { isReady }), 200);
const stylePlState = debounce((isReady: boolean) => compile('xpack/styles/pl-states.scss', { isReady }), 200);
const styleRoot = debounce((isReady: boolean) => compile('xpack/styles/root.scss', { isReady }), 200);
const styleOrganism = (srcFile: string, isReady: boolean) => compile(srcFile, { prefix: ORGANISM_PREFIX, isReady });
const styleTemplate = (srcFile: string, isReady: boolean) => compile(srcFile, { prefix: TEMPLATE_PREFIX, isReady });

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
        .filter((f) => !path.basename(f).startsWith('_'))
        .forEach((f) => styleOrganism(f, isReady));
    } else {
      styleOrganism(p, isReady);
    }
  }

  if (p.startsWith('src/templates')) {
    if (path.basename(p).startsWith('_')) {
      glob
        .sync(path.dirname(p) + '/*.scss', { nodir: true })
        .filter((f) => !path.basename(f).startsWith('_'))
        .forEach((f) => styleTemplate(f, isReady));
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

const getOutFileName = (srcFile: string): string | undefined => {
  if (path.basename(srcFile).startsWith('_')) return undefined;

  const name =
    path.basename(srcFile) === 'index.scss' ? path.basename(path.dirname(srcFile)) + '.css' : path.basename(srcFile).replace(/\.scss$/, '.css');

  if (srcFile.includes('organisms')) return ORGANISM_PREFIX + name;
  if (srcFile.includes('templates')) return TEMPLATE_PREFIX + name;

  return name;
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
