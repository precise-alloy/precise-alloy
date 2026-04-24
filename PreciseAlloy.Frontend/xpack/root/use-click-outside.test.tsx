import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOnClickOutside } from './use-click-outside';

const createRef = (el: HTMLElement | null = null) => ({ current: el });

describe('xpack/root/use-click-outside.ts', () => {
  it('calls handler when clicking outside the ref element', () => {
    const handler = vi.fn();
    const container = document.createElement('div');
    const outside = document.createElement('div');

    document.body.appendChild(container);
    document.body.appendChild(outside);

    renderHook(() => useOnClickOutside(createRef(container), handler));

    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it('does NOT call handler when clicking inside the ref element', () => {
    const handler = vi.fn();
    const container = document.createElement('div');
    const child = document.createElement('span');

    container.appendChild(child);
    document.body.appendChild(container);

    renderHook(() => useOnClickOutside(createRef(container), handler));

    child.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it('does NOT call handler when clicking inside an otherDependenceRef element', () => {
    const handler = vi.fn();
    const container = document.createElement('div');
    const otherEl = document.createElement('div');

    document.body.appendChild(container);
    document.body.appendChild(otherEl);

    renderHook(() => useOnClickOutside(createRef(container), handler, [createRef(otherEl)]));

    otherEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(container);
    document.body.removeChild(otherEl);
  });

  it('calls handler on window blur', () => {
    const handler = vi.fn();
    const container = document.createElement('div');

    document.body.appendChild(container);

    renderHook(() => useOnClickOutside(createRef(container), handler));

    window.dispatchEvent(new Event('blur'));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith();

    document.body.removeChild(container);
  });

  it('responds to touchstart events as well', () => {
    const handler = vi.fn();
    const container = document.createElement('div');
    const outside = document.createElement('div');

    document.body.appendChild(container);
    document.body.appendChild(outside);

    renderHook(() => useOnClickOutside(createRef(container), handler));

    outside.dispatchEvent(new MouseEvent('touchstart', { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it('cleans up event listeners on unmount', () => {
    const handler = vi.fn();
    const container = document.createElement('div');
    const outside = document.createElement('div');

    document.body.appendChild(container);
    document.body.appendChild(outside);

    const { unmount } = renderHook(() => useOnClickOutside(createRef(container), handler));

    unmount();

    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    window.dispatchEvent(new Event('blur'));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it('does nothing when ref.current is null', () => {
    const handler = vi.fn();
    const outside = document.createElement('div');

    document.body.appendChild(outside);

    renderHook(() => useOnClickOutside(createRef(null), handler));

    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(outside);
  });

  it('does nothing when event.target is null', () => {
    const handler = vi.fn();
    const container = document.createElement('div');

    document.body.appendChild(container);

    renderHook(() => useOnClickOutside(createRef(container), handler));

    // Create an event with no target — dispatch on document to avoid auto-target
    const event = new MouseEvent('mousedown', { bubbles: true });

    Object.defineProperty(event, 'target', { value: null });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });
});
