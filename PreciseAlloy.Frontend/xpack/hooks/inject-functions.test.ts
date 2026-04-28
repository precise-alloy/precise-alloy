import type { Plugin } from 'vite';

import { describe, expect, it, vi } from 'vitest';

import injectFunctions from './inject-functions';
import { FUNCTIONS_PLACEHOLDER, FUNCTIONS_SOURCE_PATH } from './inject-functions-core';

const getPlugin = (): Plugin => {
  const result = injectFunctions();

  if (!result || Array.isArray(result) || typeof result !== 'object' || !('name' in result)) {
    throw new Error('Expected a single plugin instance');
  }

  return result as Plugin;
};

const callTransform = (code: string, id: string) => {
  const plugin = getPlugin();
  const transform = plugin.transform;

  if (typeof transform !== 'function') {
    throw new Error('Expected a transform handler function');
  }

  const addWatchFile = vi.fn();
  const context = { addWatchFile } as unknown as ThisParameterType<typeof transform>;

  return {
    addWatchFile,
    result: transform.call(context, code, id, undefined),
  };
};

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');

  return {
    ...actual,
    default: {
      ...actual,
      readFileSync: vi.fn((filePath: string, encoding?: BufferEncoding) => {
        if (filePath === FUNCTIONS_SOURCE_PATH) {
          return '/* generated body */';
        }

        return actual.readFileSync(filePath, encoding);
      }),
    },
    readFileSync: vi.fn((filePath: string, encoding?: BufferEncoding) => {
      if (filePath === FUNCTIONS_SOURCE_PATH) {
        return '/* generated body */';
      }

      return actual.readFileSync(filePath, encoding);
    }),
  };
});

describe('xpack/hooks/inject-functions.ts', () => {
  it('registers as a pre-enforced plugin with a transform handler', () => {
    const plugin = getPlugin();

    expect(plugin.name).toBe('xpack-inject-functions');
    expect(plugin.enforce).toBe('pre');
    expect(typeof plugin.transform).toBe('function');
  });

  it('replaces the placeholder with the functions source and registers a watch file', () => {
    const code = `${FUNCTIONS_PLACEHOLDER}\nimport './main';`;
    const { result, addWatchFile } = callTransform(code, '/project/src/entry.ts');

    expect(result).toBeDefined();

    const transformed = result as { code: string; map: unknown };

    expect(transformed.code).toBe("/* generated body */\nimport './main';");
    expect(transformed.map).toBeDefined();
    expect(addWatchFile).toHaveBeenCalledWith(FUNCTIONS_SOURCE_PATH);
  });

  it('skips files without the placeholder', () => {
    const { result, addWatchFile } = callTransform("import './main';", '/project/src/entry.ts');

    expect(result).toBeUndefined();
    expect(addWatchFile).not.toHaveBeenCalled();
  });

  it('skips the functions source file itself even if the placeholder is present', () => {
    const { result, addWatchFile } = callTransform(FUNCTIONS_PLACEHOLDER, FUNCTIONS_SOURCE_PATH);

    expect(result).toBeUndefined();
    expect(addWatchFile).not.toHaveBeenCalled();
  });
});
