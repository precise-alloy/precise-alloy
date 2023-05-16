import { fileURLToPath } from 'node:url';
import path from 'path';
import { startServer } from './xserver/create-server.js';
import { loadEnv } from 'vite';

console.log('[INIT] server');
console.log(`import.meta.url = ${import.meta.url}`);

const argvModeIndex = process.argv.indexOf('--mode');
const mode = argvModeIndex >= 0 && argvModeIndex < process.argv.length - 1 && !process.argv[argvModeIndex + 1].startsWith('-') ? process.argv[argvModeIndex + 1] : 'production';
const root = path.dirname(fileURLToPath(import.meta.url));
const xpackEnv = loadEnv(mode, root);
const isTest = !!xpackEnv.VITE_TEST_BUILD || process.env.NODE_ENV === 'test';
const port = xpackEnv.VITE_PORT ? parseInt(xpackEnv.VITE_PORT) : 5000;

if (!isTest) {
  console.log(root);
  startServer({
    root,
    isTest,
    port,
    baseUrl: xpackEnv.VITE_BASE_URL
  });
}
