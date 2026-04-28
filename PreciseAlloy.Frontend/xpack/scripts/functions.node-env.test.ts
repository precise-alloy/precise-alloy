// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type MutableGlobal = Record<string, unknown>;

const runtimeGlobal = globalThis as typeof globalThis & {
  window?: typeof globalThis;
  viteAbsoluteUrl?: (path: string, addExtension?: boolean) => string;
  getCookie?: (name: string) => string | undefined;
};

const clearRuntimeGlobals = () => {
  delete (globalThis as MutableGlobal).window;
  delete (globalThis as MutableGlobal).viteAbsoluteUrl;
  delete (globalThis as MutableGlobal).getCookie;
};

const importFunctionsModuleInNode = async (env: Record<string, string> = {}) => {
  vi.resetModules();
  vi.unstubAllEnvs();

  // Strip any window/document/getCookie remnants that previous imports may
  // have attached to the shared global so the SSR guard branches actually
  // run on the current import.
  clearRuntimeGlobals();

  Object.entries(env).forEach(([key, value]) => {
    vi.stubEnv(key, value);
  });

  await import('./functions');
};

describe('xpack/scripts/functions.ts (node environment)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    clearRuntimeGlobals();
  });

  it('hoists the runtime window onto globalThis when window is undefined', async () => {
    expect(typeof (globalThis as MutableGlobal).window).toBe('undefined');

    await importFunctionsModuleInNode({
      BASE_URL: '/static/',
      VITE_PATH_EXTENSION: '.html',
    });

    // The SSR guard sets globalThis.window to the runtime global so the rest
    // of the module can attach helpers without an environment check.
    expect(runtimeGlobal.window).toBe(globalThis);
    expect(typeof runtimeGlobal.viteAbsoluteUrl).toBe('function');
  });

  it('returns the normalized remain path when BASE_URL is empty', async () => {
    await importFunctionsModuleInNode({
      BASE_URL: '',
      VITE_PATH_EXTENSION: '.html',
    });

    expect(runtimeGlobal.viteAbsoluteUrl?.('about', true)).toBe('/about.html');
    expect(runtimeGlobal.viteAbsoluteUrl?.('/contact')).toBe('/contact');
  });

  it('returns undefined from getCookie when document is unavailable in the node environment', async () => {
    await importFunctionsModuleInNode();

    expect(typeof (globalThis as MutableGlobal).document).toBe('undefined');
    expect(runtimeGlobal.getCookie?.('anything')).toBeUndefined();
  });
});
