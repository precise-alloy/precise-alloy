import { beforeEach, describe, expect, it } from 'vitest';

import { THEME_KEY, getCurrentTheme, getTheme, setTheme, switchTheme } from './handleTheme';

describe('handleTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('returns light when no theme is stored', () => {
    expect(getCurrentTheme()).toBe('light');
  });

  it('returns light or dark from the boolean helper', () => {
    expect(getTheme(true)).toBe('light');
    expect(getTheme(false)).toBe('dark');
  });

  it('persists the theme and updates the document attribute', () => {
    setTheme('dark');

    expect(localStorage.getItem(THEME_KEY)).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('treats stored light values case-insensitively', () => {
    localStorage.setItem(THEME_KEY, 'LIGHT');

    expect(getCurrentTheme()).toBe('light');
  });

  it('switches from light to dark and back again', () => {
    expect(getCurrentTheme()).toBe('light');

    switchTheme();
    expect(getCurrentTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    switchTheme();
    expect(getCurrentTheme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
