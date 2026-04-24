// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';

import handleHotUpdate from './handle-hot-update';

describe('xpack/hooks/handle-hot-update.ts', () => {
  const createContext = (file: string) => {
    const send = vi.fn();

    return {
      file,
      server: { ws: { send } },
      send,
    };
  };

  const getHook = () => {
    const plugin = handleHotUpdate() as unknown as {
      name: string;
      enforce: string;
      handleHotUpdate: (ctx: { file: string; server: { ws: { send: ReturnType<typeof vi.fn> } } }) => void;
    };

    return plugin.handleHotUpdate;
  };

  it('sends full-reload for .js files', () => {
    const { file, server, send } = createContext('/path/to/file.js');

    getHook()({ file, server });

    expect(send).toHaveBeenCalledWith({ type: 'full-reload', path: '*' });
  });

  it('sends full-reload for .css files', () => {
    const { file, server, send } = createContext('/path/to/style.css');

    getHook()({ file, server });

    expect(send).toHaveBeenCalledWith({ type: 'full-reload', path: '*' });
  });

  it('sends full-reload for .json files', () => {
    const { file, server, send } = createContext('/path/to/data.json');

    getHook()({ file, server });

    expect(send).toHaveBeenCalledWith({ type: 'full-reload', path: '*' });
  });

  it('does NOT send reload for .ts files', () => {
    const { file, server, send } = createContext('/path/to/file.ts');

    getHook()({ file, server });

    expect(send).not.toHaveBeenCalled();
  });

  it('does NOT send reload for .scss files', () => {
    const { file, server, send } = createContext('/path/to/style.scss');

    getHook()({ file, server });

    expect(send).not.toHaveBeenCalled();
  });

  it('does NOT send reload for .tsx files', () => {
    const { file, server, send } = createContext('/path/to/component.tsx');

    getHook()({ file, server });

    expect(send).not.toHaveBeenCalled();
  });

  it('returns the correct plugin metadata', () => {
    const plugin = handleHotUpdate() as { name: string; enforce: string };

    expect(plugin.name).toBe('xpack-hot-update');
    expect(plugin.enforce).toBe('post');
  });
});
