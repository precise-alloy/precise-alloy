// @vitest-environment node

import path from 'path';

import { describe, expect, it, vi } from 'vitest';

import { getHash, versionSvgPaths } from './transform-core';

describe('xpack/hooks/transform-core.ts', () => {
  describe('getHash', () => {
    it('returns a consistent 10-character base64url hash for the same content', () => {
      const hash1 = getHash('hello world');
      const hash2 = getHash('hello world');

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(10);
    });

    it('returns different hashes for different content', () => {
      const hash1 = getHash('hello');
      const hash2 = getHash('world');

      expect(hash1).not.toBe(hash2);
    });

    it('handles Buffer input', () => {
      const hash = getHash(Buffer.from('hello world'));

      expect(hash).toHaveLength(10);
      expect(hash).toBe(getHash('hello world'));
    });
  });

  describe('versionSvgPaths', () => {
    /** Build a deps object whose existsSync/readFileSync resolve via path.resolve like the production code does. */
    const makeDeps = (files: Record<string, string> = {}) => {
      const rootDir = '/project';
      // Pre-resolve keys to match what path.resolve(rootDir, 'public' + svgPath) produces
      const resolved: Record<string, string> = {};

      Object.entries(files).forEach(([svgPath, content]) => {
        resolved[path.resolve(rootDir, 'public' + svgPath)] = content;
      });

      return {
        existsSync: vi.fn((p: string) => p in resolved) as unknown as typeof import('fs').existsSync,
        readFileSync: vi.fn((p: string) => resolved[p] ?? '') as unknown as typeof import('fs').readFileSync,
        rootDir,
      };
    };

    it('appends ?v=<hash> to SVG paths when the file exists', () => {
      const deps = makeDeps({ '/assets/icons/logo.svg': '<svg></svg>' });
      const hashes: Record<string, string> = {};

      const result = versionSvgPaths('url(/assets/icons/logo.svg)', hashes, deps);

      expect(result).toMatch(/\/assets\/icons\/logo\.svg\?v=\w{10}/);
      expect(Object.keys(hashes)).toHaveLength(1);
    });

    it('skips SVG paths that already have a query string', () => {
      const deps = makeDeps();
      const hashes: Record<string, string> = {};

      const result = versionSvgPaths('url(/assets/icons/logo.svg?existing=1)', hashes, deps);

      expect(result).toBe('url(/assets/icons/logo.svg?existing=1)');
      expect(deps.existsSync).not.toHaveBeenCalled();
    });

    it('returns the original path when the file does not exist', () => {
      const deps = makeDeps({});
      const hashes: Record<string, string> = {};

      const result = versionSvgPaths('url(/assets/icons/missing.svg)', hashes, deps);

      expect(result).toBe('url(/assets/icons/missing.svg)');
    });

    it('uses cached hashes for repeated paths', () => {
      const deps = makeDeps({ '/assets/icons/logo.svg': '<svg></svg>' });
      const hashes: Record<string, string> = {};

      versionSvgPaths('url(/assets/icons/logo.svg)', hashes, deps);
      const result = versionSvgPaths('url(/assets/icons/logo.svg)', hashes, deps);

      // readFileSync should only be called once (first time)
      expect(deps.readFileSync).toHaveBeenCalledTimes(1);
      expect(result).toMatch(/\/assets\/icons\/logo\.svg\?v=\w{10}/);
    });

    it('handles multiple SVG paths in the same code string', () => {
      const deps = makeDeps({
        '/assets/icons/a.svg': '<svg>a</svg>',
        '/assets/icons/b.svg': '<svg>b</svg>',
      });
      const hashes: Record<string, string> = {};

      const result = versionSvgPaths('url(/assets/icons/a.svg) url(/assets/icons/b.svg)', hashes, deps);

      expect(result).toMatch(/\/assets\/icons\/a\.svg\?v=\w{10}/);
      expect(result).toMatch(/\/assets\/icons\/b\.svg\?v=\w{10}/);
      expect(Object.keys(hashes)).toHaveLength(2);
    });

    it('returns code unchanged when no SVG paths are present', () => {
      const deps = makeDeps();
      const hashes: Record<string, string> = {};
      const code = 'const x = 42;';

      const result = versionSvgPaths(code, hashes, deps);

      expect(result).toBe(code);
    });
  });
});
