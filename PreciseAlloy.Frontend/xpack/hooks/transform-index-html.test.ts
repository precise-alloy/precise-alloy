// @vitest-environment node

import { describe, expect, it } from 'vitest';

import transformIndexHtml from './transform-index-html';

describe('xpack/hooks/transform-index-html.ts', () => {
  const getHook = (baseUrl: string) => {
    const plugin = transformIndexHtml(baseUrl) as {
      name: string;
      enforce: string;
      transformIndexHtml: (html: string) => string;
    };

    return plugin.transformIndexHtml;
  };

  it('replaces all #__BASE_URL__/ occurrences with the provided base URL', () => {
    const transform = getHook('/my-app/');

    const html = '<link href="#__BASE_URL__/style.css"><script src="#__BASE_URL__/app.js"></script>';
    const result = transform(html);

    expect(result).toBe('<link href="/my-app/style.css"><script src="/my-app/app.js"></script>');
  });

  it('handles base URL without trailing slash', () => {
    const transform = getHook('/app');

    const html = '<link href="#__BASE_URL__/style.css">';
    const result = transform(html);

    expect(result).toBe('<link href="/appstyle.css">');
  });

  it('handles root base URL', () => {
    const transform = getHook('/');

    const html = '<link href="#__BASE_URL__/style.css">';
    const result = transform(html);

    expect(result).toBe('<link href="/style.css">');
  });

  it('returns unchanged HTML when no placeholder is present', () => {
    const transform = getHook('/my-app/');

    const html = '<link href="/style.css"><script src="/app.js"></script>';
    const result = transform(html);

    expect(result).toBe(html);
  });

  it('returns the correct plugin metadata', () => {
    const plugin = transformIndexHtml('/') as { name: string; enforce: string };

    expect(plugin.name).toBe('xpack-transform-index-html');
    expect(plugin.enforce).toBe('post');
  });
});
