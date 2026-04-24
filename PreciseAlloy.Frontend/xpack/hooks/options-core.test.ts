// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';

import { getSiteInputs } from './options-core';

describe('xpack/hooks/options-core.ts', () => {
  const makeParams = (overrides: Partial<Parameters<typeof getSiteInputs>[0]> = {}) => ({
    root: '/project',
    mode: 'development',
    scriptOnly: undefined as string | undefined,
    globSync: vi.fn(() => []) as unknown as (patterns: string[], options?: { root?: string }) => string[],
    ...overrides,
  });

  it('includes index.html when scriptOnly is falsy', () => {
    const result = getSiteInputs(makeParams());

    expect(result['index']).toBe('/project/index.html');
  });

  it('excludes index.html when scriptOnly is truthy', () => {
    const result = getSiteInputs(makeParams({ scriptOnly: 'true' }));

    expect(result['index']).toBeUndefined();
  });

  it('strips .entry.ts suffix from entry names', () => {
    const globSync = vi.fn(() => ['/project/src/assets/scripts/main/main.entry.ts']) as unknown as (
      patterns: string[],
      options?: { root?: string }
    ) => string[];
    const result = getSiteInputs(makeParams({ globSync }));

    expect(result['main']).toBe('/project/src/assets/scripts/main/main.entry.ts');
  });

  it('excludes mock-api entry in production mode', () => {
    const globSync = vi.fn(() => ['/project/xpack/scripts/mock-api.entry.ts']) as unknown as (
      patterns: string[],
      options?: { root?: string }
    ) => string[];
    const result = getSiteInputs(makeParams({ mode: 'production', globSync }));

    expect(result['mock-api']).toBeUndefined();
  });

  it('includes mock-api entry in development mode', () => {
    const globSync = vi.fn(() => ['/project/xpack/scripts/mock-api.entry.ts']) as unknown as (
      patterns: string[],
      options?: { root?: string }
    ) => string[];
    const result = getSiteInputs(makeParams({ mode: 'development', globSync }));

    expect(result['mock-api']).toBe('/project/xpack/scripts/mock-api.entry.ts');
  });

  it('handles multiple entry files', () => {
    const globSync = vi.fn(() => [
      '/project/src/assets/scripts/main/main.entry.ts',
      '/project/xpack/scripts/color-mode.entry.ts',
      '/project/xpack/scripts/root.entry.ts',
    ]) as unknown as (patterns: string[], options?: { root?: string }) => string[];
    const result = getSiteInputs(makeParams({ globSync }));

    expect(result['main']).toBe('/project/src/assets/scripts/main/main.entry.ts');
    expect(result['color-mode']).toBe('/project/xpack/scripts/color-mode.entry.ts');
    expect(result['root']).toBe('/project/xpack/scripts/root.entry.ts');
  });

  it('handles empty glob results', () => {
    const result = getSiteInputs(makeParams());

    // Only index.html should be present
    expect(Object.keys(result)).toEqual(['index']);
  });

  it('passes correct glob patterns and root to globSync', () => {
    const globSync = vi.fn(() => []) as unknown as (patterns: string[], options?: { root?: string }) => string[];

    getSiteInputs(makeParams({ globSync }));

    expect(globSync).toHaveBeenCalledWith(['/src/assets/**/*.entry.ts', '/xpack/scripts/**/*.entry.ts'], { root: '/project' });
  });

  it('skips files that do not match the .entry.ts naming convention', () => {
    // A file that has no .entry.ts suffix won't have entryName != fileName
    const globSync = vi.fn(() => ['/project/src/assets/scripts/main/utils.ts']) as unknown as (
      patterns: string[],
      options?: { root?: string }
    ) => string[];
    const result = getSiteInputs(makeParams({ globSync }));

    // utils.ts doesn't match the .entry.ts pattern, so entryName === fileName
    // The second if (entryName != fileName) won't be entered, and the file won't be added
    expect(result['utils.ts']).toBeUndefined();
  });
});
