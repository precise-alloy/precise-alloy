import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RequireJs from './RequireJs';

describe('RequireJs', () => {
  beforeEach(() => {
    vi.mocked(viteAbsoluteUrl).mockImplementation((value: string) => value);
  });

  it('renders local scripts from the javascript asset folder', () => {
    render(<RequireJs defer path="main" />);

    const script = document.querySelector('script');

    expect(script).toHaveAttribute('src', '/assets/js/main.js');
    expect(script).toHaveAttribute('type', 'module');
    expect(script).toHaveAttribute('defer', '');
  });

  it('renders vendor scripts from the vendors folder', () => {
    render(<RequireJs defer path="vendors/runtime" />);

    expect(document.querySelector('script')).toHaveAttribute('src', '/assets/vendors/runtime.js');
  });

  it('preserves absolute script URLs and forwards script attributes', () => {
    render(<RequireJs async defer inplace path="https://cdn.example.test/widget.js" type="text/javascript" />);

    const script = document.querySelector('script');

    expect(script).toHaveAttribute('src', 'https://cdn.example.test/widget.js');
    expect(script).toHaveAttribute('async', '');
    expect(script).toHaveAttribute('defer', '');
    expect(script).toHaveAttribute('data-pl-inplace', 'true');
    expect(script).toHaveAttribute('type', 'text/javascript');
  });
});
