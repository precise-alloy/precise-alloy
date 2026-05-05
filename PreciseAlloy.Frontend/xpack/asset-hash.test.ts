// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';

import {
  ASSET_HASH_REGEX,
  AssetHashDependencies,
  appendAssetHash,
  createAppendAssetHash,
  defaultAssetHashDependencies,
  rewriteAssetHashes,
} from './asset-hash';

const buildDeps = (overrides: Partial<AssetHashDependencies> = {}): AssetHashDependencies => ({
  existsSync: vi.fn().mockReturnValue(true) as never,
  readFileSync: vi.fn().mockReturnValue(Buffer.from('content')) as never,
  hash: vi.fn().mockReturnValue('h1') as never,
  resolveAssetPath: vi.fn((url: string) => '/abs' + url) as never,
  cache: {},
  logMissing: vi.fn(),
  ...overrides,
});

describe('xpack/asset-hash.ts', () => {
  it('matches every supported extension via ASSET_HASH_REGEX', () => {
    // Reset lastIndex because the regex carries the global flag and is shared
    // across this suite. Every extension we ship support for must match, and
    // an unrelated one (`mp4`) must NOT match so we never silently version
    // unknown asset types.
    const cases = ['svg', 'ttf', 'otf', 'woff', 'woff2', 'png', 'webp', 'jpg', 'jpeg', 'gif'].map((ext) => `/assets/img/x.${ext}`);

    cases.forEach((url) => {
      ASSET_HASH_REGEX.lastIndex = 0;
      expect(url.match(ASSET_HASH_REGEX)).toEqual([url]);
    });

    ASSET_HASH_REGEX.lastIndex = 0;
    expect('/assets/clip.mp4'.match(ASSET_HASH_REGEX)).toBeNull();
  });

  it('appends ?v=<hash> for an existing asset and caches the result', () => {
    const cache: Record<string, string> = {};
    const readFileSync = vi.fn().mockReturnValue(Buffer.from('body')) as never;
    const hash = vi.fn().mockReturnValue('abc') as never;
    const append = createAppendAssetHash(buildDeps({ cache, readFileSync, hash }));

    expect(append('/assets/img/a.png')).toBe('/assets/img/a.png?v=abc');
    expect(cache['/assets/img/a.png']).toBe('abc');

    // Second call must hit the cache: no further fs / hash work happens.
    expect(append('/assets/img/a.png')).toBe('/assets/img/a.png?v=abc');
    expect(readFileSync).toHaveBeenCalledTimes(1);
    expect(hash).toHaveBeenCalledTimes(1);
  });

  it('hashes text assets after LF normalization so checkout line endings do not change versions', () => {
    const hash = vi.fn((content: Buffer | string) => (content === '<svg>\n</svg>\n' ? 'lfhash' : 'rawhash')) as never;
    const append = createAppendAssetHash(
      buildDeps({
        readFileSync: vi.fn().mockReturnValue(Buffer.from('<svg>\r\n</svg>\r\n')) as never,
        hash,
      })
    );

    expect(append('/assets/images/icon.svg')).toBe('/assets/images/icon.svg?v=lfhash');
    expect(hash).toHaveBeenCalledWith('<svg>\n</svg>\n');
  });

  it('keeps binary asset bytes unchanged when hashing', () => {
    const content = Buffer.from([0, 1, 2, 3]);
    const hash = vi.fn().mockReturnValue('binaryhash') as never;
    const append = createAppendAssetHash(
      buildDeps({
        readFileSync: vi.fn().mockReturnValue(content) as never,
        hash,
      })
    );

    expect(append('/assets/images/photo.png')).toBe('/assets/images/photo.png?v=binaryhash');
    expect(hash).toHaveBeenCalledWith(content);
  });

  it('skips URLs that already carry a query string', () => {
    // Already-versioned URLs (anything containing `?`) must be passed through
    // untouched so callers that intentionally annotate a URL are not
    // double-versioned and we never read disk for them.
    const existsSync = vi.fn() as never;
    const append = createAppendAssetHash(buildDeps({ existsSync }));

    expect(append('/assets/img/a.png?v=manual')).toBe('/assets/img/a.png?v=manual');
    expect(existsSync).not.toHaveBeenCalled();
  });

  it('logs and returns the original URL when the asset is missing on disk', () => {
    const logMissing = vi.fn();
    const append = createAppendAssetHash(
      buildDeps({
        existsSync: vi.fn().mockReturnValue(false) as never,
        logMissing,
      })
    );

    expect(append('/assets/img/missing.png')).toBe('/assets/img/missing.png');
    expect(logMissing).toHaveBeenCalledWith('/abs/assets/img/missing.png');
  });

  it('rewrites every matching URL in a CSS payload using injected dependencies', () => {
    const css = "body { background: url('/assets/img/a.png'); src: url('/assets/fonts/b.woff2') format('woff2'); }";
    const out = rewriteAssetHashes(
      css,
      buildDeps({
        hash: vi.fn().mockReturnValueOnce('h1').mockReturnValueOnce('h2') as never,
      })
    );

    expect(out).toContain('/assets/img/a.png?v=h1');
    expect(out).toContain('/assets/fonts/b.woff2?v=h2');
  });

  it('falls back to the production replacer when no dependencies are passed', () => {
    // Strings without any matching URL must round-trip unchanged through the
    // production replacer (covers the `dependencies ? ... : appendAssetHash`
    // branch without touching the real on-disk public/assets tree).
    expect(rewriteAssetHashes('body { color: red; }')).toBe('body { color: red; }');
  });

  it('exercises the default dependencies against a real public asset', () => {
    // Drives the actual `fs.readFileSync` / `path.resolve(root, ...)` /
    // `getAssetVersion` / `console.error` arrows so the production
    // `defaultAssetHashDependencies` factory hits 100% function coverage.
    // `public/assets/images/logo.svg` is a stable repository asset.
    const realAsset = '/assets/images/logo.svg';
    const versioned = appendAssetHash(realAsset);

    expect(versioned).toMatch(/^\/assets\/images\/logo\.svg\?v=[A-Za-z0-9_-]+$/);

    // Missing-asset path: real `existsSync` returns false, real `logMissing`
    // arrow runs through `console.error` (silenced) and the URL is returned
    // unchanged.
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const missing = '/assets/images/__definitely-missing__.png';

    expect(appendAssetHash(missing)).toBe(missing);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0]?.[0]).toContain('public/assets/images/__definitely-missing__.png');
    errorSpy.mockRestore();

    // The default cache must record the resolved hash for repeated lookups.
    expect(defaultAssetHashDependencies.cache[realAsset]).toBeDefined();
  });
});
