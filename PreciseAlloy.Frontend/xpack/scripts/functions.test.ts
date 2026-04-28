import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const importFunctionsModule = async (env: Record<string, string> = {}) => {
  vi.resetModules();
  vi.unstubAllEnvs();

  Object.entries(env).forEach(([key, value]) => {
    vi.stubEnv(key, value);
  });

  await import('./functions');
};

describe('xpack/scripts/functions.ts', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('composes modifiers from base, global, style, and theme values', async () => {
    await importFunctionsModule();

    expect(
      getModifiers(
        {
          globalModifier: ['section-margin-top'],
          styleModifier: ['compact'],
          theme: 'dark',
        } as BasedAtomicModel,
        'zzz-o-card'
      )
    ).toBe('zzz-o-card section-margin-top zzz-o-card--compact theme-dark');
  });

  it('returns only the base class when no modifiers or theme are provided', async () => {
    await importFunctionsModule();

    expect(getModifiers({} as BasedAtomicModel, 'zzz-o-card')).toBe('zzz-o-card');
  });

  it('normalizes relative paths and preserves absolute URLs', async () => {
    await importFunctionsModule({
      BASE_URL: '/static/',
      VITE_PATH_EXTENSION: '.html',
    });

    expect(viteAbsoluteUrl('portfolio', true)).toBe('/static/portfolio.html');
    expect(viteAbsoluteUrl('/contact')).toBe('/static/contact');
    expect(viteAbsoluteUrl('https://example.com/app.js')).toBe('https://example.com/app.js');
  });

  it('handles base URLs without a trailing slash', async () => {
    await importFunctionsModule({
      BASE_URL: '/portal',
      VITE_PATH_EXTENSION: '.html',
    });

    expect(viteAbsoluteUrl('about', true)).toBe('/portal/about.html');
  });

  it('reads cookies by trimmed name and returns undefined when missing', async () => {
    await importFunctionsModule();

    vi.spyOn(document, 'cookie', 'get').mockReturnValue('feature=on; theme=dark');

    expect(window.getCookie('feature')).toBe('on');
    expect(window.getCookie('theme')).toBe('dark');
    expect(window.getCookie('missing')).toBeUndefined();
  });
});
