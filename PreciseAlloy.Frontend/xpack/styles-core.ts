import type { Stats } from 'fs';
import type { ChokidarOptions } from 'chokidar';

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import slash from 'slash';
import { RawSourceMap, SourceMapConsumer, SourceMapGenerator } from 'source-map-js';

export interface StyleCoreDependencies {
  existsSync: typeof fs.existsSync;
  readFileSync: typeof fs.readFileSync;
}

const defaultDependencies: StyleCoreDependencies = {
  existsSync: fs.existsSync,
  readFileSync: fs.readFileSync,
};

const STYLE_WATCH_POLL_INTERVAL_MS = 200;

export const isStyleWatchIgnored = (filePath: string, stats?: Pick<Stats, 'isFile'>) => {
  return !!stats?.isFile() && !filePath.endsWith('.scss');
};

export const getStyleWatchOptions = (): ChokidarOptions => {
  return {
    ignored: isStyleWatchIgnored,
    // Native file events are not reliable for every editor/remote-volume path
    // this workspace is used through; when they are missed, Sass sources change
    // but `public/assets/css/*.css` stays stale until a manual `touch`. Polling
    // keeps watch mode deterministic, and the interval matches the compile
    // debounce so quick save bursts are still coalesced before Sass runs.
    usePolling: true,
    interval: STYLE_WATCH_POLL_INTERVAL_MS,
    awaitWriteFinish: {
      stabilityThreshold: STYLE_WATCH_POLL_INTERVAL_MS,
      pollInterval: STYLE_WATCH_POLL_INTERVAL_MS / 2,
    },
  };
};

export const prepareCssFileContent = (
  {
    srcFile,
    includeMixins = true,
    includeAbstracts = true,
    includeFunctions = true,
  }: {
    srcFile: string;
    includeMixins?: boolean;
    includeAbstracts?: boolean;
    /**
     * Inject the `01-functions/functions` barrel so partials gain global
     * access to helpers like `px2rem`, `rtl`, and `str-replace`. There is no
     * `@forward` chain that re-exposes these from `00-abstracts` or
     * `01-mixins`, so each consuming file needs its own `@use ... as *`. We
     * inject it here for the same reason we inject the abstracts/mixins
     * barrels: every component partial expects these helpers to resolve
     * without ceremony, the way they did under the legacy `@import` setup.
     */
    includeFunctions?: boolean;
  },
  dependencies: Pick<StyleCoreDependencies, 'readFileSync'> = defaultDependencies
) => {
  return [
    includeAbstracts
      ? slash(`@use '${path.relative(path.dirname(srcFile), path.resolve('src/assets/styles/00-abstracts/abstracts'))}' as *;\n`)
      : undefined,
    includeFunctions
      ? slash(`@use '${path.relative(path.dirname(srcFile), path.resolve('src/assets/styles/01-functions/functions'))}' as *;\n`)
      : undefined,
    includeMixins ? slash(`@use '${path.relative(path.dirname(srcFile), path.resolve('src/assets/styles/01-mixins/mixins'))}' as *;\n`) : undefined,
    dependencies.readFileSync(srcFile, 'utf-8'),
  ].filter((content): content is string => content !== undefined);
};

export const createScssImporterResult = (filePath: string, contents: string) => {
  return {
    contents,
    syntax: 'scss' as const,
    // Sass falls back to embedding importer-provided sources as `data:` URLs
    // when `sourceMapUrl` is omitted. That makes DevTools show imported SCSS
    // partials under synthetic `data:` filenames instead of the real file on
    // disk. We still return the prelude-injected contents here so compilation
    // sees the shared mixins/functions, but we pin the sourcemap identity to
    // the actual file URL so `stripInjectedPreludeFromSourceMap()` can later
    // remove the synthetic prelude lines while keeping the original filename.
    sourceMapUrl: pathToFileURL(path.resolve(filePath)),
  };
};

const fileUrlToPath = (url: URL) => {
  decodeURI(url.href);

  return fileURLToPath(url);
};

export const resolveSourceMapPath = (source: string, sourceRoot?: string | null): string | undefined => {
  const isWindowsDrivePath = (value: string) => /^[a-zA-Z]:[\\/]/.test(value);

  if (source.startsWith('data:')) {
    return undefined;
  }

  try {
    if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(source) && !isWindowsDrivePath(source)) {
      return fileUrlToPath(new URL(source));
    }

    if (sourceRoot && /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(sourceRoot) && !isWindowsDrivePath(sourceRoot)) {
      return fileUrlToPath(new URL(source, sourceRoot));
    }
  } catch {
    return undefined;
  }

  return path.resolve(sourceRoot ?? '.', source);
};

export const stripInjectedPreludeFromSourceMap = (
  sourceMap: RawSourceMap,
  dependencies: StyleCoreDependencies = defaultDependencies
): RawSourceMap => {
  const consumer = new SourceMapConsumer(sourceMap);
  const generator = new SourceMapGenerator({
    file: sourceMap.file,
    sourceRoot: sourceMap.sourceRoot,
  });
  const sourceLineOffsets = new Map<string, number>();

  consumer.sources.forEach((source) => {
    const sourceContent = consumer.sourceContentFor(source, true);
    const filePath = resolveSourceMapPath(source, consumer.sourceRoot);

    if (!filePath || !sourceContent || !dependencies.existsSync(filePath)) {
      generator.setSourceContent(source, sourceContent ?? undefined);

      return;
    }

    const realSourceContent = dependencies.readFileSync(filePath, 'utf-8');

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

export const getStylesOutputFileName = (
  srcFile: string,
  { organismPrefix = 'b-', templatePrefix = 'p-' }: { organismPrefix?: string; templatePrefix?: string } = {}
) => {
  if (path.basename(srcFile).startsWith('_')) {
    return undefined;
  }

  const name =
    path.basename(srcFile) === 'index.scss' ? path.basename(path.dirname(srcFile)) + '.css' : path.basename(srcFile).replace(/\.scss$/, '.css');

  if (srcFile.includes('organisms')) {
    return organismPrefix + name;
  }

  if (srcFile.includes('templates')) {
    return templatePrefix + name;
  }

  return name;
};
