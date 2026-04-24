// @vitest-environment node

import { SourceMapConsumer, SourceMapGenerator } from 'source-map-js';
import { describe, expect, it, vi } from 'vitest';

import { getStylesOutputFileName, prepareCssFileContent, resolveSourceMapPath, stripInjectedPreludeFromSourceMap } from './styles-core';

describe('xpack/styles-core.ts', () => {
  it('injects abstracts and mixins into component scss by default', () => {
    const result = prepareCssFileContent(
      { srcFile: 'src/organisms/hero/index.scss' },
      {
        readFileSync: vi.fn().mockReturnValue('.hero { color: red; }') as never,
      }
    );

    expect(result).toEqual([
      '../../assets/styles/00-abstracts/abstracts'.startsWith('../../')
        ? "@use '../../assets/styles/00-abstracts/abstracts' as *;\n"
        : expect.any(String),
      "@use '../../assets/styles/01-mixins/mixins' as *;\n",
      '.hero { color: red; }',
    ]);
  });

  it('supports disabling abstracts or mixins when building content', () => {
    expect(
      prepareCssFileContent(
        { srcFile: 'src/assets/styles/01-mixins/_buttons.scss', includeMixins: false },
        {
          readFileSync: vi.fn().mockReturnValue('.button { color: red; }') as never,
        }
      )
    ).toEqual(["@use '../00-abstracts/abstracts' as *;\n", '.button { color: red; }']);
  });

  it('resolves source map paths for data urls, file urls, rooted urls, and relative files', () => {
    expect(resolveSourceMapPath('data:text/plain;base64,QQ==')).toBeUndefined();
    expect(resolveSourceMapPath('file:///D:/repo/src/file.scss')).toMatch(/src[\\/]file\.scss$/);
    expect(resolveSourceMapPath('file.scss', 'file:///D:/repo/src/')).toMatch(/src[\\/]file\.scss$/);
    expect(resolveSourceMapPath('file.scss', 'D:/repo/src')).toMatch(/repo[\\/]src[\\/]file\.scss$/);
    expect(resolveSourceMapPath('file.scss', '://bad-root')).toMatch(/bad-root[\\/]file\.scss$/);
    expect(resolveSourceMapPath('file:///%ZZ')).toBeUndefined();
  });

  it('strips injected prelude lines from source maps and preserves real source content', () => {
    const source = 'file:///D:/repo/src/hero.scss';
    const generator = new SourceMapGenerator({ file: 'hero.css' });

    generator.setSourceContent(source, "@use 'a';\n@use 'b';\n.hero { color: red; }");
    generator.addMapping({
      generated: { line: 1, column: 0 },
      original: { line: 3, column: 0 },
      source,
    });

    const result = stripInjectedPreludeFromSourceMap(generator.toJSON(), {
      existsSync: vi.fn().mockReturnValue(true) as never,
      readFileSync: vi.fn().mockReturnValue('.hero { color: red; }') as never,
    });
    const consumer = new SourceMapConsumer(result);

    expect(consumer.originalPositionFor({ line: 1, column: 0 }).line).toBe(1);
    expect(consumer.sourceContentFor(source, true)).toBe('.hero { color: red; }');
  });

  it('preserves source content when the injected prelude cannot be matched to the real file', () => {
    const source = 'file:///D:/repo/src/hero.scss';
    const generator = new SourceMapGenerator({ file: 'hero.css' });

    generator.setSourceContent(source, "@use 'a';\n.hero { color: red; }");
    generator.addMapping({
      generated: { line: 1, column: 0 },
      original: { line: 2, column: 0 },
      source,
    });

    const result = stripInjectedPreludeFromSourceMap(generator.toJSON(), {
      existsSync: vi.fn().mockReturnValue(true) as never,
      readFileSync: vi.fn().mockReturnValue('.other { color: blue; }') as never,
    });
    const consumer = new SourceMapConsumer(result);

    expect(consumer.originalPositionFor({ line: 1, column: 0 }).line).toBe(2);
    expect(consumer.sourceContentFor(source, true)).toBe("@use 'a';\n.hero { color: red; }");
  });

  it('keeps source content when the source file cannot be resolved on disk', () => {
    const source = 'file:///D:/repo/src/hero.scss';
    const generator = new SourceMapGenerator({ file: 'hero.css' });

    generator.setSourceContent(source, '.hero { color: red; }');
    generator.addMapping({
      generated: { line: 1, column: 0 },
      original: { line: 1, column: 0 },
      source,
    });

    const result = stripInjectedPreludeFromSourceMap(generator.toJSON(), {
      existsSync: vi.fn().mockReturnValue(false) as never,
      readFileSync: vi.fn() as never,
    });
    const consumer = new SourceMapConsumer(result);

    expect(consumer.sourceContentFor(source, true)).toBe('.hero { color: red; }');
    expect(consumer.originalPositionFor({ line: 1, column: 0 }).line).toBe(1);
  });

  it('preserves generated-only mappings and drops mappings shifted before line one', () => {
    const source = 'file:///D:/repo/src/hero.scss';
    const generator = new SourceMapGenerator({ file: 'hero.css' });

    generator.setSourceContent(source, "@use 'a';\n@use 'b';\n.hero { color: red; }");
    generator.addMapping({
      generated: { line: 1, column: 0 },
    });
    generator.addMapping({
      generated: { line: 2, column: 0 },
      original: { line: 1, column: 0 },
      source,
    });

    const result = stripInjectedPreludeFromSourceMap(generator.toJSON(), {
      existsSync: vi.fn().mockReturnValue(true) as never,
      readFileSync: vi.fn().mockReturnValue('.hero { color: red; }') as never,
    });
    const consumer = new SourceMapConsumer(result);

    expect(consumer.originalPositionFor({ line: 1, column: 0 }).line).toBeNull();
    expect(consumer.originalPositionFor({ line: 2, column: 0 }).line).toBeNull();
  });

  it('derives css output names for organisms, templates, shared styles, and partials', () => {
    expect(getStylesOutputFileName('src/organisms/hero/index.scss')).toBe('b-hero.css');
    expect(getStylesOutputFileName('src/templates/home/index.scss')).toBe('p-home.css');
    expect(getStylesOutputFileName('src/assets/styles/style-base.scss')).toBe('style-base.css');
    expect(getStylesOutputFileName('src/organisms/hero/_shared.scss')).toBeUndefined();
    expect(getStylesOutputFileName('src/organisms/hero/index.scss', { organismPrefix: 'org-' })).toBe('org-hero.css');
    expect(getStylesOutputFileName('src/templates/home/index.scss', { templatePrefix: 'tpl-' })).toBe('tpl-home.css');
  });
});
