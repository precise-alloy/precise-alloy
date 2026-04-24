/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

import chokidar from 'chokidar';
import { glob } from 'glob';
import slash from 'slash';
import { transformWithEsbuild } from 'vite';

type ScriptGlobSync = (pattern: string) => string[];

export interface ScriptCoreDependencies {
  existsSync: typeof fs.existsSync;
  mkdirSync: typeof fs.mkdirSync;
  readFileSync: typeof fs.readFileSync;
  writeFileSync: typeof fs.writeFileSync;
  transformWithEsbuild: typeof transformWithEsbuild;
  globSync: ScriptGlobSync;
  createWatcher: typeof chokidar.watch;
  log: (message?: unknown, ...optionalParams: unknown[]) => void;
}

export const defaultScriptCoreDependencies: ScriptCoreDependencies = {
  existsSync: fs.existsSync,
  mkdirSync: fs.mkdirSync,
  readFileSync: fs.readFileSync,
  writeFileSync: fs.writeFileSync,
  transformWithEsbuild,
  globSync: glob.sync,
  createWatcher: chokidar.watch,
  log: console.log.bind(console),
};

export const getScriptTransformOptions = (inputPath: string) => ({
  minify: true,
  format: 'esm' as const,
  sourcemap: path.basename(inputPath).includes('critical') ? false : ('external' as const),
});

export const getScriptOutputPath = (inputPath: string) => {
  return path.resolve('public/assets/js/' + path.parse(inputPath).name + '.js');
};

export const compileScript = async (inputPath: string, dependencies: ScriptCoreDependencies = defaultScriptCoreDependencies) => {
  dependencies.log('compile:', slash(inputPath));

  const code = dependencies.readFileSync(inputPath, 'utf8');

  return dependencies
    .transformWithEsbuild(code, inputPath, getScriptTransformOptions(inputPath))
    .then((result) => {
      const savePath = getScriptOutputPath(inputPath);
      const saveDir = path.dirname(savePath);

      if (!dependencies.existsSync(saveDir)) {
        dependencies.mkdirSync(saveDir);
      }

      dependencies.writeFileSync(savePath, result.code);
    })
    .catch((error) => {
      dependencies.log(error);
    });
};

export const watchScripts = (dependencies: ScriptCoreDependencies = defaultScriptCoreDependencies) => {
  const watcher = dependencies.createWatcher('src/assets/scripts/**/*.{js,jsx,ts,tsx}');

  watcher
    .on('add', (inputPath) => compileScript(inputPath, dependencies))
    .on('change', (inputPath) => compileScript(inputPath, dependencies))
    .on('unlink', (inputPath) => dependencies.log(`File ${inputPath} has been removed`));

  return watcher;
};

export const compileDiscoveredScripts = async (dependencies: ScriptCoreDependencies = defaultScriptCoreDependencies) => {
  const pool: Promise<unknown>[] = [];

  dependencies.globSync('src/assets/scripts/**/*.{js,jsx,ts,tsx}').forEach((inputPath) => {
    pool.push(compileScript(inputPath, dependencies));
  });

  await Promise.all(pool);
};

export const runScriptBuild = async (argv = process.argv, dependencies: ScriptCoreDependencies = defaultScriptCoreDependencies) => {
  if (argv.includes('--watch')) {
    return watchScripts(dependencies);
  }

  return compileDiscoveredScripts(dependencies);
};
