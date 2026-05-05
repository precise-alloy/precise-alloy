// @vitest-environment node

import * as cheerio from 'cheerio';
import { describe, expect, it, vi } from 'vitest';

import {
  getUpdatedResourcePath,
  hasContentHashInFileName,
  hashFileContent,
  parsePrerenderArgs,
  removeDuplicateAssets,
  removeStyleBase,
  updateResourcePath,
  viteAbsoluteUrl,
} from './prerender-core';

describe('xpack/prerender-core.ts', () => {
  it('parses prerender mode and add-hash flags from argv', () => {
    expect(parsePrerenderArgs(['node', 'xpack/prerender.ts'])).toEqual({
      mode: 'production',
      addHash: false,
    });
    expect(parsePrerenderArgs(['node', 'xpack/prerender.ts', '--mode', 'eshn', '--add-hash'])).toEqual({
      mode: 'eshn',
      addHash: true,
    });
  });

  it('normalizes absolute urls from base path settings', () => {
    expect(viteAbsoluteUrl({ baseUrl: '/', pathExtension: '.html' }, 'about', true)).toBe('/about.html');
    expect(viteAbsoluteUrl({ baseUrl: '/portal', pathExtension: '.html' }, 'about', true)).toBe('/portal/about.html');
    expect(viteAbsoluteUrl({ baseUrl: '/portal/', pathExtension: '.html' }, '/contact')).toBe('/portal/contact');
    // Empty baseUrl falls back to the normalized remain path without prefix.
    expect(viteAbsoluteUrl({ baseUrl: '' }, 'about')).toBe('/about');
    expect(viteAbsoluteUrl({ baseUrl: '' }, 'about', true)).toBe('/about');
  });

  it('detects existing content hashes and produces stable 10-character hashes', () => {
    expect(hasContentHashInFileName('/assets/js/main.0xBzdr-bw_.js')).toBe(true);
    expect(hasContentHashInFileName('/assets/js/main.js')).toBe(false);
    expect(hashFileContent(Buffer.from('hello world'))).toHaveLength(10);
    expect(hashFileContent(Buffer.from('hello world'))).toBe(hashFileContent(Buffer.from('hello world')));
  });

  it('prefixes domains and appends cache-busting hashes for eligible local assets', () => {
    const onMissingPath = vi.fn();

    expect(
      getUpdatedResourcePath('/assets/js/main.js', {
        addHash: true,
        baseUrl: '/',
        domain: 'https://cdn.example.test',
        toAbsolute: (value) => `/repo/${value}`,
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(Buffer.from('main bundle')),
        onMissingPath,
      })
    ).toMatch(/^https:\/\/cdn\.example\.test\/assets\/js\/main\.js\?v=/);

    expect(onMissingPath).not.toHaveBeenCalled();
  });

  it('hashes eligible text resource paths from LF-normalized bytes', () => {
    expect(
      getUpdatedResourcePath('/assets/images/logo.svg', {
        addHash: true,
        baseUrl: '/',
        toAbsolute: (value) => `/repo/${value}`,
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(Buffer.from('<svg>\r\n</svg>\r\n')),
      })
    ).toBe('/assets/images/logo.svg?v=' + hashFileContent('<svg>\n</svg>\n'));
  });

  it('skips vendor hashing, hashed filenames, missing mock-api files, and unsupported paths', () => {
    const onMissingPath = vi.fn();

    expect(
      getUpdatedResourcePath('/assets/vendors/runtime.js', {
        addHash: true,
        baseUrl: '/',
        domain: 'https://cdn.example.test',
        toAbsolute: (value) => `/repo/${value}`,
        existsSync: vi.fn().mockReturnValue(false),
        readFileSync: vi.fn(),
        onMissingPath,
      })
    ).toBe('https://cdn.example.test/assets/vendors/runtime.js');

    expect(
      getUpdatedResourcePath('/assets/js/main.0xBzdr-bw_.js', {
        addHash: true,
        baseUrl: '/',
        domain: undefined,
        toAbsolute: (value) => `/repo/${value}`,
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync: vi.fn().mockReturnValue(Buffer.from('bundle')),
        onMissingPath,
      })
    ).toBe('/assets/js/main.0xBzdr-bw_.js');

    expect(
      getUpdatedResourcePath('/assets/js/mock-api.js', {
        addHash: true,
        baseUrl: '/',
        domain: undefined,
        toAbsolute: () => '/repo/dist/static/assets/js/mock-api.js',
        existsSync: vi.fn().mockReturnValue(false),
        readFileSync: vi.fn(),
        onMissingPath,
      })
    ).toBe('/assets/js/mock-api.js');

    expect(
      getUpdatedResourcePath('https://example.com/main.js', {
        addHash: true,
        baseUrl: '/',
        domain: undefined,
        toAbsolute: (value) => value,
        existsSync: vi.fn(),
        readFileSync: vi.fn(),
        onMissingPath,
      })
    ).toBe('https://example.com/main.js');

    expect(onMissingPath).not.toHaveBeenCalled();
  });

  it('prefixes the domain on eligible assets without appending a hash when addHash is false', () => {
    const onMissingPath = vi.fn();
    const readFileSync = vi.fn();

    expect(
      getUpdatedResourcePath('/assets/js/main.js', {
        addHash: false,
        baseUrl: '/',
        domain: 'https://cdn.example.test',
        toAbsolute: () => '/repo/dist/static/assets/js/main.js',
        existsSync: vi.fn().mockReturnValue(true),
        readFileSync,
        onMissingPath,
      })
    ).toBe('https://cdn.example.test/assets/js/main.js');

    expect(readFileSync).not.toHaveBeenCalled();
    expect(onMissingPath).not.toHaveBeenCalled();
  });

  it('warns about missing eligible assets except mock-api.js', () => {
    const onMissingPath = vi.fn();

    expect(
      getUpdatedResourcePath('/assets/js/main.js', {
        addHash: true,
        baseUrl: '/',
        domain: undefined,
        toAbsolute: () => '/repo/dist/static/assets/js/main.js',
        existsSync: vi.fn().mockReturnValue(false),
        readFileSync: vi.fn(),
        onMissingPath,
      })
    ).toBe('/assets/js/main.js');

    expect(onMissingPath).toHaveBeenCalledWith('/repo/dist/static/assets/js/main.js');
  });

  it('updates DOM resource paths in place', () => {
    const $ = cheerio.load('<head></head><body><script src="/assets/js/main.js"></script></body>');

    updateResourcePath($, 'script', 'src', {
      addHash: true,
      baseUrl: '/',
      domain: 'https://cdn.example.test',
      toAbsolute: () => '/repo/dist/static/assets/js/main.js',
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue(Buffer.from('bundle')),
    });

    expect($('script').attr('src')).toMatch(/^https:\/\/cdn\.example\.test\/assets\/js\/main\.js\?v=/);
  });

  it('skips elements that have no value for the targeted attribute', () => {
    const $ = cheerio.load('<head></head><body><script></script><script src="/assets/js/main.js"></script></body>');
    const existsSync = vi.fn().mockReturnValue(true);
    const readFileSync = vi.fn().mockReturnValue(Buffer.from('bundle'));

    updateResourcePath($, 'script', 'src', {
      addHash: true,
      baseUrl: '/',
      domain: 'https://cdn.example.test',
      toAbsolute: () => '/repo/dist/static/assets/js/main.js',
      existsSync,
      readFileSync,
    });

    // The first <script> has no src and is skipped via the early return.
    expect($('script').eq(0).attr('src')).toBeUndefined();
    expect($('script').eq(1).attr('src')).toMatch(/^https:\/\/cdn\.example\.test\/assets\/js\/main\.js\?v=/);
  });

  it('leaves elements untouched when the resolved path is identical to the original', () => {
    const $ = cheerio.load('<head></head><body><script src="https://cdn.example.test/external.js"></script></body>');

    updateResourcePath($, 'script', 'src', {
      addHash: true,
      baseUrl: '/',
      domain: undefined,
      toAbsolute: (value) => value,
      existsSync: vi.fn(),
      readFileSync: vi.fn(),
    });

    // Absolute external URL is returned unchanged, exercising the `newPath === href` branch.
    expect($('script').attr('src')).toBe('https://cdn.example.test/external.js');
  });

  it('removes style-base stylesheets only', () => {
    const $ = cheerio.load(
      '<head><link rel="stylesheet" href="/assets/css/style-base.css"><link rel="stylesheet" href="/assets/css/b-hero.css"></head><body></body>'
    );

    removeStyleBase($);

    expect($('link[href*="style-base"]').length).toBe(0);
    expect($('link[href*="b-hero"]').length).toBe(1);
  });

  it('moves unique required assets to head, removes duplicates, and normalizes module defer attributes', () => {
    const $ = cheerio.load(
      '<head></head><body>' +
        '<script data-pl-require src="/assets/js/main.js" type="module" defer="defer"></script>' +
        '<script data-pl-require src="/assets/js/main.js" type="module" defer="true"></script>' +
        '</body>'
    );
    const paths: string[] = [];

    removeDuplicateAssets($, 'script[data-pl-require][src]', 'src', paths);

    expect(paths).toEqual(['/assets/js/main.js']);
    expect($('head script').length).toBe(1);
    expect($('head script').attr('data-pl-require')).toBeUndefined();
    expect($('head script').attr('defer')).toBeUndefined();
    expect($('body script').length).toBe(0);
    expect($.html()).toContain('<!-- <script');
  });

  it('removes a bare defer attribute on module scripts during deduplication', () => {
    const $ = cheerio.load('<head></head><body>' + '<script data-pl-require src="/assets/js/main.js" type="module" defer></script>' + '</body>');
    const paths: string[] = [];

    removeDuplicateAssets($, 'script[data-pl-require][src]', 'src', paths);

    expect(paths).toEqual(['/assets/js/main.js']);
    expect($('head script').length).toBe(1);
    expect($('head script').attr('defer')).toBeUndefined();
  });

  it('removes a defer="true" attribute on module scripts during deduplication', () => {
    // Each unique script enters the defer normalization block once; cover the
    // defer="true" comparator (the third operand of the || chain on the inner if).
    const $ = cheerio.load(
      '<head></head><body>' + '<script data-pl-require src="/assets/js/truthy.js" type="module" defer="true"></script>' + '</body>'
    );
    const paths: string[] = [];

    removeDuplicateAssets($, 'script[data-pl-require][src]', 'src', paths);

    expect(paths).toEqual(['/assets/js/truthy.js']);
    expect($('head script').attr('defer')).toBeUndefined();
  });

  it('keeps non-module defer attributes intact during deduplication', () => {
    const $ = cheerio.load('<head></head><body>' + '<script data-pl-require src="/assets/js/legacy.js" defer="defer"></script>' + '</body>');
    const paths: string[] = [];

    removeDuplicateAssets($, 'script[data-pl-require][src]', 'src', paths);

    expect($('head script').attr('defer')).toBe('defer');
  });

  it('skips deduplication entries that match the selector but lack the targeted attribute value', () => {
    // A broader selector lets defensive `if (!resourcePath)` early return
    // execute when an element matches but has no resolvable value for `attr`.
    const $ = cheerio.load('<head></head><body><script data-pl-require></script></body>');
    const paths: string[] = [];

    removeDuplicateAssets($, 'script[data-pl-require]', 'src', paths);

    expect(paths).toEqual([]);
    expect($('head script').length).toBe(0);
    expect($('body script').length).toBe(1);
  });

  it('leaves inplace assets where they are', () => {
    const $ = cheerio.load('<head></head><body><script data-pl-require data-pl-inplace="true" src="/assets/js/main.js"></script></body>');
    const paths: string[] = [];

    removeDuplicateAssets($, 'script[data-pl-require][src]', 'src', paths);

    expect(paths).toEqual([]);
    expect($('head script').length).toBe(0);
    expect($('body script').length).toBe(1);
  });
});
