// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { getAssetFileName, getChunkFileName, getEntryFileName } from './filename';

const createAsset = (overrides: {}) => ({
  name: 'Main Style',
  names: [],
  originalFileName: null,
  originalFileNames: [],
  source: '',
  type: 'asset',
  ...overrides,
});

const createChunk = (overrides: {}) => ({
  exports: [],
  facadeModuleId: null,
  isDynamicEntry: false,
  isEntry: true,
  isImplicitEntry: false,
  moduleIds: [],
  name: 'hero',
  type: 'chunk',
  ...overrides,
});

describe('xpack/filename.ts', () => {
  it('hashes asset filenames and normalizes spaces to hyphens', () => {
    expect(getAssetFileName(createAsset({}))).toBe('assets/js/main-style.0x[hash].css');
  });

  it('keeps entry-server unhashed and maps index to react-loader', () => {
    expect(getEntryFileName(createChunk({ name: 'entry-server' }))).toBe('entry-server.js');
    expect(getEntryFileName(createChunk({ name: 'index' }))).toBe('assets/js/react-loader.0x[hash].js');
  });

  it('writes non-index entry files without hashes and chunk files with hashes', () => {
    expect(getEntryFileName(createChunk({}))).toBe('assets/js/hero.js');
    expect(getChunkFileName(createChunk({ isDynamicEntry: true, isEntry: false }))).toBe('assets/js/hero.0x[hash].js');
  });
});
