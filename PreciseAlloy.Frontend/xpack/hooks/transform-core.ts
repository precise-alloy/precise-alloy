import path from 'path';
import fs from 'fs';
import crypto from 'node:crypto';

export interface TransformCoreDependencies {
  existsSync: typeof fs.existsSync;
  readFileSync: typeof fs.readFileSync;
  rootDir: string;
}

const defaultDependencies: TransformCoreDependencies = {
  existsSync: fs.existsSync,
  readFileSync: fs.readFileSync,
  rootDir: '',
};

export const getHash = (content: Buffer | string): string => {
  const sha1Hash = crypto.createHash('sha1');

  sha1Hash.update(content);

  return sha1Hash.digest('base64url').substring(0, 10);
};

export const versionSvgPaths = (
  code: string,
  hashes: Record<string, string>,
  dependencies: TransformCoreDependencies = defaultDependencies
): string => {
  return code.replaceAll(/\/assets\/[a-z0-9./_-]+\.svg\b\??/gi, (s) => {
    if (s.includes('?')) {
      return s;
    }

    if (hashes[s]) {
      return s + '?v=' + hashes[s];
    }

    const svgPath = path.resolve(dependencies.rootDir, 'public' + s);

    if (dependencies.existsSync(svgPath)) {
      const content = dependencies.readFileSync(svgPath);
      const hash = getHash(content);

      hashes[s] = hash;

      return s + '?v=' + hash;
    }

    return s;
  });
};
