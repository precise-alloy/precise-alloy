import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

Object.assign(globalThis, {
  alert: vi.fn(),
  getModifiers: vi.fn((model: BasedAtomicModel, baseClass: string) => {
    const classes = [baseClass];

    model.globalModifier?.forEach((modifier) => classes.push(modifier));
    model.styleModifier?.forEach((modifier) => classes.push(baseClass + '--' + modifier));

    if (model.theme) {
      classes.push('theme-' + model.theme);
    }

    return classes.join(' ');
  }),
  viteAbsoluteUrl: vi.fn((value: string) => value),
});
