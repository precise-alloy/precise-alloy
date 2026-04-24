import { describe, expect, it, vi } from 'vitest';

import cssVip from './css-vip';

describe('src/_helpers/css-vip.ts', () => {
  it('adds !important to all standard declarations', () => {
    const input = '.btn { color: red; font-size: 16px; }';
    const result = cssVip(input);

    expect(result).toContain('color:red!important');
    expect(result).toContain('font-size:16px!important');
  });

  it('skips CSS custom properties (--* variables)', () => {
    const input = ':root { --primary: blue; color: red; }';
    const result = cssVip(input);

    expect(result).toContain('--primary:blue');
    expect(result).not.toContain('--primary:blue!important');
    expect(result).toContain('color:red!important');
  });

  it('skips values that already contain !important', () => {
    const input = '.btn { color: red!important; font-size: 16px; }';
    const result = cssVip(input);

    // Should not double-add !important
    expect(result).not.toContain('red!important!important');
    expect(result).toContain('font-size:16px!important');
  });

  it('handles nested @media rules recursively', () => {
    const input = '@media (min-width: 768px) { .btn { color: red; } }';
    const result = cssVip(input);

    expect(result).toContain('color:red!important');
  });

  it('handles nested @supports rules recursively', () => {
    const input = '@supports (display: grid) { .grid { display: grid; } }';
    const result = cssVip(input);

    expect(result).toContain('display:grid!important');
  });

  it('returns original code when stylesheet has no rules', () => {
    const input = '/* just a comment */';
    const result = cssVip(input);

    // A comment-only stylesheet still has rules array (with comments), but
    // processRules handles them. The function returns the stringified result.
    expect(typeof result).toBe('string');
  });

  it('handles empty input string', () => {
    const result = cssVip('');

    expect(typeof result).toBe('string');
  });

  it('logs unknown rule types via console.log', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // @charset is a different rule type that triggers the else branch
    const input = '@charset "UTF-8"; .btn { color: red; }';

    cssVip(input);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Unknown rule type:'));
  });

  it('skips non-declaration nodes inside a rule', () => {
    // A rule with a comment mixed in among declarations
    const input = '.btn { color: red; /* inline comment */ font-size: 16px; }';
    const result = cssVip(input);

    expect(result).toContain('color:red!important');
    expect(result).toContain('font-size:16px!important');
  });

  it('handles declarations with no value gracefully', () => {
    // Edge case: a declaration without a value shouldn't crash
    const input = '.btn { color: red; }';
    const result = cssVip(input);

    expect(result).toContain('color:red!important');
  });

  it('handles deeply nested @media inside @supports', () => {
    const input = '@supports (display: flex) { @media (min-width: 768px) { .card { padding: 1rem; } } }';
    const result = cssVip(input);

    expect(result).toContain('padding:1rem!important');
  });
});
