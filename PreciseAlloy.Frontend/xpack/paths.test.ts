// @vitest-environment node

import path from 'path';

import slash from 'slash';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('vite', () => ({
  loadEnv: vi.fn(() => ({})),
}));

describe('xpack/paths.ts', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('getAbsolutePath returns slashed absolute path unchanged', async () => {
    const { getAbsolutePath } = await import('./paths');

    const absPath = path.resolve('/some/absolute/path');
    const result = getAbsolutePath(absPath);

    expect(result).toBe(slash(absPath));
  });

  it('getAbsolutePath resolves relative path against root', async () => {
    const { getAbsolutePath, root } = await import('./paths');

    const result = getAbsolutePath('src/file.ts');

    expect(result).toBe(slash(path.resolve(root, 'src/file.ts')));
  });

  it('root is a slashed absolute path ending at the project root', async () => {
    const { root } = await import('./paths');

    expect(path.isAbsolute(root.replace(/\//g, path.sep))).toBe(true);
    expect(root).toMatch(/PreciseAlloy\.Frontend$/);
  });

  it('mode defaults to production when --mode flag is absent', async () => {
    const savedArgv = [...process.argv];

    process.argv = process.argv.filter((a) => a !== '--mode');

    const { mode } = await import('./paths');

    expect(mode).toBe('production');

    process.argv = savedArgv;
  });

  it('mode reads the value after --mode when present', async () => {
    const savedArgv = [...process.argv];

    process.argv = [...process.argv, '--mode', 'development'];

    const { mode } = await import('./paths');

    expect(mode).toBe('development');

    process.argv = savedArgv;
  });

  it('mode defaults to production when --mode is the last argument', async () => {
    const savedArgv = [...process.argv];

    process.argv = [...process.argv, '--mode'];

    const { mode } = await import('./paths');

    expect(mode).toBe('production');

    process.argv = savedArgv;
  });

  it('mode defaults to production when the value after --mode starts with -', async () => {
    const savedArgv = [...process.argv];

    process.argv = [...process.argv, '--mode', '--watch'];

    const { mode } = await import('./paths');

    expect(mode).toBe('production');

    process.argv = savedArgv;
  });

  it('exports srcRoot, viteSharedRoot, and outDir as slashed paths', async () => {
    const { srcRoot, viteSharedRoot, outDir } = await import('./paths');

    expect(srcRoot).toContain('/src');
    expect(viteSharedRoot).toContain('/xpack/shared');
    expect(outDir).toContain('/dist');
    expect(srcRoot).not.toContain('\\');
    expect(viteSharedRoot).not.toContain('\\');
    expect(outDir).not.toContain('\\');
  });
});
