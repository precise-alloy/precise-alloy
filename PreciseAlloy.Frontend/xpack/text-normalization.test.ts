// @vitest-environment node

import { describe, expect, it } from 'vitest';

import {
  isTextLikeContent,
  isTextLikePath,
  normalizeSourceMapLineEndings,
  normalizeTextFileContent,
  normalizeTextLikeContent,
  normalizeTextLineEndings,
} from './text-normalization';

describe('xpack/text-normalization.ts', () => {
  it('normalizes Windows and legacy Mac line endings to LF', () => {
    expect(normalizeTextLineEndings('a\r\nb\rc\n')).toBe('a\nb\nc\n');
  });

  it('detects text-like paths even when they include query strings or hashes', () => {
    expect(isTextLikePath('/assets/images/icon.svg?v=abc#shape')).toBe(true);
    expect(isTextLikePath('/assets/css/site.css.map')).toBe(true);
    expect(isTextLikePath('/assets/images/photo.png?v=abc')).toBe(false);
  });

  it('detects text-like content without relying on file extensions', () => {
    expect(isTextLikeContent('plain text')).toBe(true);
    expect(isTextLikeContent(Buffer.alloc(0))).toBe(true);
    expect(isTextLikeContent(Buffer.from('custom text\r\n'))).toBe(true);
    expect(isTextLikeContent(Buffer.from([0xff, 0xd8, 0xff, 0x00]))).toBe(false);
    expect(isTextLikeContent(Buffer.from([1, 2, 3, 4]))).toBe(false);
  });

  it('normalizes source map sourcesContent while preserving maps that need no changes', () => {
    const sourceMap = JSON.stringify({ version: 3, sourcesContent: ['a\r\nb', null], mappings: '' });
    const normalizedSourceMap = JSON.stringify({ version: 3, sourcesContent: ['a\nb', null], mappings: '' });
    const alreadyNormalized = JSON.stringify({ version: 3, sourcesContent: ['a\nb'], mappings: '' });

    expect(normalizeSourceMapLineEndings(sourceMap)).toBe(normalizedSourceMap);
    expect(normalizeSourceMapLineEndings(alreadyNormalized)).toBe(alreadyNormalized);
    expect(normalizeSourceMapLineEndings(JSON.stringify({ version: 3, mappings: '' }))).toBe(JSON.stringify({ version: 3, mappings: '' }));
    expect(normalizeSourceMapLineEndings('{not-json')).toBe('{not-json');
  });

  it('normalizes physical line endings before source map JSON content', () => {
    const sourceMap = '{"version":3,"sourcesContent":["a\\r\\nb"],"mappings":""}\r\n';

    expect(normalizeTextFileContent('/assets/js/app.js.map', sourceMap)).toBe('{"version":3,"sourcesContent":["a\\nb"],"mappings":""}');
  });

  it('normalizes text-like Buffer and string content while leaving binary assets untouched', () => {
    const binary = Buffer.from([0, 1, 2, 3]);

    expect(normalizeTextLikeContent('/assets/images/icon.svg', Buffer.from('<svg>\r\n</svg>\r\n'))).toBe('<svg>\n</svg>\n');
    expect(normalizeTextLikeContent('/assets/js/main.js', 'const value = 1;\r\n')).toBe('const value = 1;\n');
    expect(normalizeTextLikeContent('/assets/custom/template', Buffer.from('content\r\n'))).toBe('content\n');
    expect(normalizeTextLikeContent('/assets/images/photo.png', binary)).toBe(binary);
  });
});
