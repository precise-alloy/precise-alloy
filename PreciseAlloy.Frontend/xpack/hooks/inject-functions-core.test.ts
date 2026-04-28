import { describe, expect, it, vi } from 'vitest';

import {
  FUNCTIONS_PLACEHOLDER,
  FUNCTIONS_SOURCE_PATH,
  containsFunctionsPlaceholder,
  defaultInjectFunctionsDependencies,
  loadFunctionsSource,
} from './inject-functions-core';

describe('xpack/hooks/inject-functions-core.ts', () => {
  it('exposes the placeholder string and resolved source path', () => {
    expect(FUNCTIONS_PLACEHOLDER).toBe('/* DO NOT REMOVE - AUTO-IMPORTS FUNCTIONS PLACEHOLDER */');
    expect(FUNCTIONS_SOURCE_PATH.endsWith('xpack/scripts/functions.ts')).toBe(true);
  });

  it('detects code that contains the placeholder', () => {
    expect(containsFunctionsPlaceholder(`${FUNCTIONS_PLACEHOLDER}\nimport './main';`)).toBe(true);
    expect(containsFunctionsPlaceholder("import './main';")).toBe(false);
  });

  it('loads the functions source via the injected reader', () => {
    const readFileSync = vi.fn().mockReturnValue('// generated functions');

    const source = loadFunctionsSource('/abs/path/functions.ts', { readFileSync });

    expect(readFileSync).toHaveBeenCalledWith('/abs/path/functions.ts', 'utf8');
    expect(source).toBe('// generated functions');
  });

  it('falls back to the default reader and source path', () => {
    const readFileSync = vi.fn().mockReturnValue('// default-read');

    const source = loadFunctionsSource(undefined, { readFileSync });

    expect(readFileSync).toHaveBeenCalledWith(FUNCTIONS_SOURCE_PATH, 'utf8');
    expect(source).toBe('// default-read');
  });

  it('exposes the real fs.readFileSync as the default dependency', () => {
    expect(typeof defaultInjectFunctionsDependencies.readFileSync).toBe('function');
  });
});
