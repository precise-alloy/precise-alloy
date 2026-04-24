import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RequireCss from './RequireCss';

describe('RequireCss', () => {
  beforeEach(() => {
    vi.mocked(viteAbsoluteUrl).mockImplementation((value: string) => value);
  });

  it('renders local component styles from the css asset folder by default', () => {
    render(<RequireCss path="b-hero" />);

    const link = document.querySelector('link');

    expect(link).toHaveAttribute('href', '/assets/css/b-hero.css');
    expect(link).toHaveAttribute('rel', 'stylesheet');
  });

  it('renders vendor styles from the vendors folder', () => {
    render(<RequireCss path="vendors/swiper" />);

    expect(document.querySelector('link')).toHaveAttribute('href', '/assets/vendors/swiper.css');
  });

  it('preserves absolute URLs and forwards custom rel values', () => {
    render(<RequireCss path="https://cdn.example.test/styles.css" rel="modulepreload" />);

    const link = document.querySelector('link');

    expect(link).toHaveAttribute('href', 'https://cdn.example.test/styles.css');
    expect(link).toHaveAttribute('rel', 'modulepreload');
  });
});
