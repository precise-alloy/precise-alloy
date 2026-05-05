import path from 'path';

import slash from 'slash';

import { hashFileContent, hasContentHashInFileName, parsePrerenderArgs } from './prerender-core';
import { normalizeTextLikeContent, normalizeTextLineEndings } from './text-normalization';

export interface CopyItem {
  from: string;
  to?: string;
}

export interface FileExistCheck {
  folder?: string;
  fileName: string | RegExp;
}

export interface IntegrationDependencies {
  existsSync: (value: string) => boolean;
  statSync: (value: string) => { isDirectory: () => boolean };
  rmSync: (target: string, options?: { recursive?: boolean; force?: boolean }) => void;
  mkdirSync: (target: string, options?: { recursive?: boolean }) => void;
  cpSync: (source: string, destination: string, options?: { recursive?: boolean; force?: boolean }) => void;
  copyFileSync: (source: string, destination: string) => void;
  readFileSync: (path: string, encoding?: BufferEncoding) => string | Buffer;
  writeFileSync: (path: string, data: string) => void;
  readdirSync: (path: string) => string[];
  globSync: (pattern: string, options?: { nodir?: boolean }) => string[];
  nodeFsCpSync: (source: string, destination: string, options?: { recursive?: boolean }) => void;
  log: (message?: unknown, ...optionalParams: unknown[]) => void;
  warn: (value: string) => unknown;
}

export interface IntegrationConfig {
  argv: string[];
  staticBasePath: string;
  srcBasePath: string;
  destBasePath: string;
  patternPath?: string;
  copyItems: CopyItem[];
  hashItems: string[];
  checkExistFileList: FileExistCheck[];
}

export const parseIntegrationArgs = (argv: string[]) => {
  return {
    mode: parsePrerenderArgs(argv).mode,
  };
};

export const copyConfiguredItems = (
  copyItems: CopyItem[],
  { srcBasePath, destBasePath }: Pick<IntegrationConfig, 'srcBasePath' | 'destBasePath'>,
  dependencies: IntegrationDependencies
) => {
  copyItems.forEach((item) => {
    const srcPath = slash(path.join(srcBasePath, item.from));
    const destPath = slash(item.to ?? path.join(destBasePath, item.from));

    if (!dependencies.existsSync(srcPath)) {
      return;
    }

    dependencies.log(`Copy file ${srcPath} to ${destPath}`);

    if (dependencies.statSync(srcPath).isDirectory()) {
      if (dependencies.existsSync(destPath)) {
        dependencies.rmSync(destPath, { recursive: true, force: true });
      }

      dependencies.mkdirSync(destPath, { recursive: true });
      dependencies.cpSync(srcPath, destPath, { recursive: true, force: true });
    } else {
      const destDirPath = path.dirname(destPath);

      if (!dependencies.existsSync(destDirPath)) {
        dependencies.mkdirSync(destDirPath);
      }

      dependencies.copyFileSync(srcPath, destPath);
    }
  });
};

export const collectAssetHashes = (
  hashItems: string[],
  { staticBasePath, srcBasePath }: Pick<IntegrationConfig, 'staticBasePath' | 'srcBasePath'>,
  dependencies: Pick<IntegrationDependencies, 'globSync' | 'readFileSync'>
) => {
  const hashes: Map<string, string> = new Map();

  hashItems.forEach((item) => {
    const srcPath = slash(path.join(srcBasePath, item));
    const files = dependencies.globSync(srcPath + '/**/*.{css,js,svg}');

    files.forEach((file) => {
      const relativePath = slash(file.substring(staticBasePath.length));
      const fileContent = dependencies.readFileSync(file);

      if (!hasContentHashInFileName(file)) {
        hashes.set(relativePath, hashFileContent(normalizeTextLikeContent(file, fileContent)));
      } else {
        hashes.set(relativePath, '');
      }
    });
  });

  return hashes;
};

export const sortHashes = (hashes: Map<string, string>) => {
  return Array.from(hashes)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reduce(
      (obj, [key, value]) => {
        obj[key] = value;

        return obj;
      },
      {} as { [key: string]: string }
    );
};

export const getPatternCopyTarget = (patternPath: string, sourcePath: string) => {
  let basename = '';
  const segments = slash(sourcePath).split('/');

  if (segments.length < 4) {
    return undefined;
  }

  switch (segments.length) {
    case 4:
      basename = path.basename(slash(sourcePath).replaceAll(/(atoms|molecules|organisms|templates|pages)\/([\w._-]+)$/gi, '$1-$2'));

      return {
        sourcePath,
        targetPath: slash(path.join(patternPath, basename)),
        recursive: false,
      };
    default:
      segments.splice(0, 2);

      return {
        sourcePath,
        targetPath: slash(path.join(patternPath, segments.join('-'))),
        recursive: true,
      };
  }
};

export const normalizePatternHtml = (text: string) => {
  return normalizeTextLineEndings(text)
    .replaceAll(/react-loader\.0x[a-z0-9_-]{8,12}\.js/gi, 'react-loader.0x00000000.js')
    .replaceAll(/\.svg\?v=[a-z0-9_-]+/gi, '.svg')
    .replaceAll(/(<\/footer>)\n{2,}(\s*<script\s+type="module"\n\s+defer=""\n\s+src="\/assets\/js\/pl-states\.js"><\/script>)/g, '$1\n$2');
};

export const normalizeGeneratedTextFiles = (
  targetPath: string,
  dependencies: Pick<IntegrationDependencies, 'globSync' | 'readFileSync' | 'writeFileSync'>
) => {
  dependencies.globSync(slash(path.join(targetPath, '**/*')), { nodir: true }).forEach((file) => {
    const fileContent = dependencies.readFileSync(file);
    const text = typeof fileContent === 'string' ? fileContent : fileContent.toString('utf-8');
    const newText = normalizeTextLikeContent(file, fileContent);

    if (typeof newText === 'string' && text !== newText) {
      dependencies.writeFileSync(file, newText);
    }
  });
};

export const copyPatternArtifacts = (
  patternPath: string,
  dependencies: Pick<IntegrationDependencies, 'mkdirSync' | 'globSync' | 'copyFileSync' | 'nodeFsCpSync'>
) => {
  dependencies.mkdirSync(patternPath, { recursive: true });
  dependencies.globSync('./dist/static/{atoms,molecules,organisms,templates,pages}/**/*.*').forEach((patternSource) => {
    const target = getPatternCopyTarget(patternPath, patternSource);

    if (!target) {
      return;
    }

    if (target.recursive) {
      dependencies.nodeFsCpSync(target.sourcePath, target.targetPath, { recursive: true });
    } else {
      dependencies.copyFileSync(target.sourcePath, target.targetPath);
    }
  });
};

export const normalizePatternFiles = (
  patternPath: string,
  dependencies: Pick<IntegrationDependencies, 'globSync' | 'readFileSync' | 'writeFileSync'>
) => {
  dependencies.globSync(slash(path.join(patternPath, '**/*.{htm,html}'))).forEach((patternFile) => {
    const fileContent = dependencies.readFileSync(patternFile, 'utf-8');
    const text = typeof fileContent === 'string' ? fileContent : fileContent.toString('utf-8');
    const newText = normalizePatternHtml(text);

    if (text !== newText) {
      dependencies.writeFileSync(patternFile, newText);
    }
  });
};

export const validateExpectedFiles = (
  checkExistFileList: FileExistCheck[],
  destBasePath: string,
  dependencies: Pick<IntegrationDependencies, 'existsSync' | 'readdirSync' | 'log' | 'warn'>
) => {
  const missing: string[] = [];

  checkExistFileList.forEach((file) => {
    if (typeof file.fileName === 'string') {
      const destPath = slash(path.join(destBasePath, file.folder ?? '', file.fileName.toString()));

      if (!dependencies.existsSync(destPath)) {
        missing.push(destPath);
        dependencies.log(dependencies.warn(`Cannot find: ${destPath}`));
      }
    } else {
      const fileName = file.fileName;
      const folderFiles = slash(path.join(destBasePath, file.folder ?? ''));
      const files = dependencies.readdirSync(folderFiles);
      const found = files.find((fileEntry) => fileName.test(fileEntry));

      if (!found) {
        const missingPath = slash(path.join(folderFiles, fileName.toString()));

        missing.push(missingPath);
        dependencies.log(dependencies.warn(`Cannot find: ${missingPath}`));
      }
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
  };
};

export const runIntegrationBuild = (config: IntegrationConfig, dependencies: IntegrationDependencies) => {
  if (config.patternPath && dependencies.existsSync(config.patternPath)) {
    dependencies.rmSync(config.patternPath, { recursive: true, force: true });
    dependencies.mkdirSync(config.patternPath, { recursive: true });
  }

  copyConfiguredItems(config.copyItems, config, dependencies);

  const hashes = collectAssetHashes(config.hashItems, config, dependencies);
  const sortedHashes = sortHashes(hashes);

  dependencies.writeFileSync(path.join(config.destBasePath, 'hashes.json'), JSON.stringify(sortedHashes, null, '  '));
  normalizeGeneratedTextFiles(config.destBasePath, dependencies);

  if (config.patternPath) {
    copyPatternArtifacts(config.patternPath, dependencies);
    normalizePatternFiles(config.patternPath, dependencies);
  }

  return validateExpectedFiles(config.checkExistFileList, config.destBasePath, dependencies);
};
