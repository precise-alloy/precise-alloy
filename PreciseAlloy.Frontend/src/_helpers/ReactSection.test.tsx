import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ReactSection from './ReactSection';

describe('ReactSection', () => {
  beforeEach(() => {
    vi.mocked(viteAbsoluteUrl).mockImplementation((value: string) => value);
  });

  it('renders only the JSON script when no css is provided', () => {
    render(<ReactSection data={{ id: 1 }} type="hero" />);

    const script = document.querySelector('script');

    expect(script).toHaveAttribute('data-rct', 'hero');
    expect(script).toHaveAttribute('type', 'application/json');
    expect(script).toHaveTextContent('{"id":1}');
    expect(document.querySelector('link')).toBeNull();
  });

  it('renders a single stylesheet requirement when css is a string', () => {
    render(<ReactSection css="b-hero" data={{ id: 1 }} type="hero" />);

    expect(document.querySelector('link')).toHaveAttribute('href', '/assets/css/b-hero.css');
    expect(document.querySelector('script')).toHaveAttribute('data-rct', 'hero');
  });

  it('renders one stylesheet requirement per css entry when css is an array', () => {
    render(<ReactSection css={['style-base', 'b-hero']} data={{ id: 1 }} type="hero" />);

    expect(Array.from(document.querySelectorAll('link')).map((item) => item.getAttribute('href'))).toEqual([
      '/assets/css/style-base.css',
      '/assets/css/b-hero.css',
    ]);
  });
});
