import path from 'path';
import slash from 'slash';
import { loadEnv } from 'vite';

export const root = slash(path.resolve(__dirname, '..'));

export const xpackEnv = loadEnv('production', root) as ImportMetaEnv;

export const srcRoot = slash(path.resolve(root, 'src'));
export const typesRoot = slash(path.resolve(srcRoot, '_types'));
export const viteSharedRoot = slash(path.resolve(root, 'xpack/shared'));
export const outDir = slash(path.resolve(root, 'dist'));

export const getAbsolutePath = (p: string) => {
  return path.isAbsolute(p) ? slash(p) : slash(path.resolve(root, p));
};
