import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import React from 'react';

import { RootContext, RootData, useRootContext } from './root-context';

describe('xpack/root/root-context.ts', () => {
  it('returns default context with noop setters when no provider is present', () => {
    const { result } = renderHook(() => useRootContext());

    expect(result.current.activeItem).toBeUndefined();
    expect(result.current.isTopPanel).toBeUndefined();
    expect(typeof result.current.setActiveItem).toBe('function');
    expect(typeof result.current.setTopPanel).toBe('function');

    // Noop setters should not throw
    result.current.setActiveItem();
    result.current.setTopPanel(true);
  });

  it('returns provided context when wrapped in RootContext.Provider', () => {
    const activeItem: SinglePageNode = {
      type: 'single',
      name: 'Home',
      path: '/',
    };

    const mockContext: RootData = {
      activeItem,
      setActiveItem: () => {},
      isTopPanel: true,
      setTopPanel: () => {},
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => React.createElement(RootContext.Provider, { value: mockContext }, children);

    const { result } = renderHook(() => useRootContext(), { wrapper });

    expect(result.current.activeItem).toBe(activeItem);
    expect(result.current.isTopPanel).toBe(true);
  });
});
