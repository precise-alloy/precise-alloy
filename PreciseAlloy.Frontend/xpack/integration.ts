/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodeFs from 'node:fs';

import slash from 'slash';
import { glob } from 'glob';
import { loadEnv } from 'vite';
import chalk from 'chalk';

import { CopyItem, FileExistCheck, parseIntegrationArgs, runIntegrationBuild } from './integration-core';

const { mode } = parseIntegrationArgs(process.argv);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const xpackEnv = loadEnv(mode, projectRoot);
const toAbsolute = (p: string) => slash(path.resolve(projectRoot, p));
const log = console.log.bind(console);

const staticBasePath = toAbsolute('dist/static');
const srcBasePath = toAbsolute('dist/static/assets');
const destBasePath = toAbsolute(xpackEnv.VITE_INTE_ASSET_DIR);
const patternPath = xpackEnv.VITE_INTE_PATTERN_DIR ? toAbsolute(xpackEnv.VITE_INTE_PATTERN_DIR) : undefined;

const copyItems: CopyItem[] = [
  { from: 'css' },
  { from: 'fonts' },
  { from: 'images' },
  { from: 'js' },
  { from: 'vendors' },
  { from: 'hashes.json' },
  { from: 'pages', to: patternPath },
];
const hashItems: string[] = ['css', 'images', 'js'];

const checkExistFileList: FileExistCheck[] = [
  { fileName: 'hashes.json' },
  { fileName: /react-loader\.0x[a-z0-9_-]{8,12}\.js/gi, folder: 'js' },
  { fileName: 'main.js', folder: 'js' },
];
const result = runIntegrationBuild(
  {
    argv: process.argv,
    staticBasePath,
    srcBasePath,
    destBasePath,
    patternPath,
    copyItems,
    hashItems,
    checkExistFileList,
  },
  {
    existsSync: fs.existsSync,
    statSync: fs.statSync,
    rmSync: fs.rmSync,
    mkdirSync: fs.mkdirSync,
    cpSync: fs.cpSync,
    copyFileSync: fs.copyFileSync,
    readFileSync: fs.readFileSync,
    writeFileSync: fs.writeFileSync,
    readdirSync: fs.readdirSync,
    globSync: glob.sync,
    nodeFsCpSync: nodeFs.cpSync,
    log,
    warn: (value: string) => chalk.yellow(value),
  }
);

if (!result.isValid) {
  process.exit(1);
}
