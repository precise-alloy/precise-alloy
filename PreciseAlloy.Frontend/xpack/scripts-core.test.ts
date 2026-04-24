// @vitest-environment node

import type { FSWatcher } from 'chokidar';

import { describe, expect, it, vi } from 'vitest';

import {
  compileScript,
  compileDiscoveredScripts,
  getScriptOutputPath,
  getScriptTransformOptions,
  runScriptBuild,
  watchScripts,
} from './scripts-core';

const createDependencies = () => {
  const watcher = {
    on: vi.fn(function (this: FSWatcher) {
      return this;
    }),
  } as unknown as FSWatcher;

  return {
    dependencies: {
      existsSync: vi.fn().mockReturnValue(true),
      mkdirSync: vi.fn(),
      readFileSync: vi.fn().mockReturnValue('export const value = 1;'),
      writeFileSync: vi.fn(),
      transformWithEsbuild: vi.fn().mockResolvedValue({ code: 'compiled-code' }),
      globSync: vi.fn().mockReturnValue(['src/assets/scripts/main.ts', 'src/assets/scripts/critical.ts']),
      createWatcher: vi.fn().mockReturnValue(watcher),
      log: vi.fn(),
    },
    watcher,
  };
};

describe('xpack/scripts-core', () => {
  it('derives the existing transform options from the input file name', () => {
    expect(getScriptTransformOptions('src/assets/scripts/main.ts')).toEqual({
      minify: true,
      format: 'esm',
      sourcemap: 'external',
    });
    expect(getScriptTransformOptions('src/assets/scripts/main-critical.ts')).toEqual({
      minify: true,
      format: 'esm',
      sourcemap: false,
    });
  });

  it('writes compiled output into public/assets/js using the source file name', async () => {
    const { dependencies } = createDependencies();

    dependencies.existsSync.mockReturnValue(false);

    await compileScript('src/assets/scripts/main.ts', dependencies);

    expect(dependencies.readFileSync).toHaveBeenCalledWith('src/assets/scripts/main.ts', 'utf8');
    expect(dependencies.transformWithEsbuild).toHaveBeenCalledWith('export const value = 1;', 'src/assets/scripts/main.ts', {
      minify: true,
      format: 'esm',
      sourcemap: 'external',
    });
    expect(dependencies.mkdirSync).toHaveBeenCalledWith(expect.stringMatching(/[\\/]public[\\/]assets[\\/]js$/));
    expect(dependencies.writeFileSync).toHaveBeenCalledWith(getScriptOutputPath('src/assets/scripts/main.ts'), 'compiled-code');
    expect(dependencies.log).toHaveBeenCalledWith('compile:', 'src/assets/scripts/main.ts');
  });

  it('logs transform failures instead of throwing', async () => {
    const { dependencies } = createDependencies();
    const error = new Error('compile failed');

    dependencies.transformWithEsbuild.mockRejectedValueOnce(error);

    await expect(compileScript('src/assets/scripts/main.ts', dependencies)).resolves.toBeUndefined();

    expect(dependencies.log).toHaveBeenCalledWith(error);
    expect(dependencies.writeFileSync).not.toHaveBeenCalled();
  });

  it('compiles every discovered script in non-watch mode', async () => {
    const { dependencies } = createDependencies();

    await compileDiscoveredScripts(dependencies);

    expect(dependencies.globSync).toHaveBeenCalledWith('src/assets/scripts/**/*.{js,jsx,ts,tsx}');
    expect(dependencies.transformWithEsbuild).toHaveBeenCalledTimes(2);
  });

  it('wires add, change, and unlink handlers in watch mode', () => {
    const { dependencies, watcher } = createDependencies();

    const watched = watchScripts(dependencies);

    expect(dependencies.createWatcher).toHaveBeenCalledWith('src/assets/scripts/**/*.{js,jsx,ts,tsx}');
    expect(watcher.on).toHaveBeenNthCalledWith(1, 'add', expect.any(Function));
    expect(watcher.on).toHaveBeenNthCalledWith(2, 'change', expect.any(Function));
    expect(watcher.on).toHaveBeenNthCalledWith(3, 'unlink', expect.any(Function));
    expect(watched).toBe(watcher);
  });

  it('routes argv into watch or compile mode', async () => {
    const watchDependencies = createDependencies().dependencies;
    const buildDependencies = createDependencies().dependencies;

    await runScriptBuild(['node', 'xpack/scripts.ts', '--watch'], watchDependencies);
    await runScriptBuild(['node', 'xpack/scripts.ts'], buildDependencies);

    expect(watchDependencies.createWatcher).toHaveBeenCalledTimes(1);
    expect(buildDependencies.globSync).toHaveBeenCalledTimes(1);
  });
});
