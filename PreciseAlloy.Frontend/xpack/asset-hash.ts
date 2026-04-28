/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

import { root } from './paths';
import { getAssetVersion } from './cryptography';

// Regex that matches `/assets/<path>.<ext>` URLs we want to cache-bust.
//
// Notes:
// - The non-capturing group `(?:...)` is intentional. The previous version in
//   `xpack/hooks/transform.ts` used `(:?...)` which is a bug — it matches a
//   literal `:` optionally and then the alternation. The replacement still
//   "worked" because we use the full match `s`, but the regex was wrong.
// - Trailing `\??` accepts an already-present `?` so we can detect (and skip)
//   URLs that already carry a query string in the replacer below.
// - Extensions cover the union of what CSS and JS/TS modules can reference:
//   fonts (ttf/otf/woff/woff2), raster images (png/webp/jpg/jpeg/gif) and
//   vector images (svg). `fig` from the legacy regex was almost certainly a
//   typo for `gif` and is intentionally not carried over.
export const ASSET_HASH_REGEX = /\/assets\/[a-z0-9./_-]+\.(?:svg|ttf|otf|woff|woff2|png|webp|jpg|jpeg|gif)\b\??/gi;

export interface AssetHashDependencies {
  existsSync: typeof fs.existsSync;
  readFileSync: (filePath: string) => Buffer;
  hash: typeof getAssetVersion;
  resolveAssetPath: (assetUrl: string) => string;
  cache: Record<string, string>;
  logMissing: (absPath: string) => void;
}

const defaultCache: Record<string, string> = {};

export const defaultAssetHashDependencies: AssetHashDependencies = {
  existsSync: fs.existsSync,
  readFileSync: (filePath: string) => fs.readFileSync(filePath),
  hash: getAssetVersion,
  resolveAssetPath: (assetUrl: string) => path.resolve(root, 'public' + assetUrl),
  // Process-wide cache of `/assets/...` path -> content hash. Shared across
  // every caller (CSS post-processing, the Vite `xpack-transform` plugin,
  // etc.) so any given asset file is read from disk and hashed at most once
  // per build, regardless of how many modules or stylesheets reference it.
  cache: defaultCache,
  logMissing: (absPath: string) => console.error(`File not found: ${absPath}`),
};

/**
 * Pure builder for the `appendAssetHash` replacer. Tests inject their own
 * `AssetHashDependencies` so the cache, fs, and logging can be observed
 * without touching real disk or mutating the shared production cache.
 */
export const createAppendAssetHash =
  (dependencies: AssetHashDependencies = defaultAssetHashDependencies) =>
  (assetUrl: string): string => {
    if (assetUrl.includes('?')) {
      // Already versioned (or has any query string) — leave it alone.
      return assetUrl;
    }

    const cached = dependencies.cache[assetUrl];

    if (cached) {
      return assetUrl + '?v=' + cached;
    }

    const absPath = dependencies.resolveAssetPath(assetUrl);

    if (dependencies.existsSync(absPath)) {
      const hash = dependencies.hash(dependencies.readFileSync(absPath));

      dependencies.cache[assetUrl] = hash;

      return assetUrl + '?v=' + hash;
    }

    dependencies.logMissing(absPath);

    return assetUrl;
  };

/**
 * Replacer suitable for `String#replaceAll` (and `MagicString#replaceAll`)
 * that appends a content-hash query string (`?v=<hash>`) to `/assets/...`
 * URLs. URLs that already carry a query string are returned unchanged so
 * callers that intentionally annotate a URL aren't double-versioned.
 *
 * Missing files are logged but the original path is preserved — this keeps
 * the build noisy without breaking the whole pipeline on a single bad ref.
 */
export const appendAssetHash = createAppendAssetHash();

/**
 * Convenience wrapper that runs `appendAssetHash` over every matching URL
 * in a string. Used by CSS post-processing where we operate on the raw
 * compiled output (no MagicString involved).
 */
export const rewriteAssetHashes = (input: string, dependencies?: AssetHashDependencies): string =>
  input.replaceAll(ASSET_HASH_REGEX, dependencies ? createAppendAssetHash(dependencies) : appendAssetHash);
