import { fileURLToPath } from 'node:url';
import path from 'path';
import { startServer } from './xserver/create-server.js';
import { loadEnv } from 'vite';

const argvModeIndex = process.argv.indexOf('--mode');
const mode = argvModeIndex >= 0 && argvModeIndex < process.argv.length - 1 && !process.argv[argvModeIndex + 1].startsWith('-') ? process.argv[argvModeIndex + 1] : 'production';
console.log('[INIT] server');
console.log(`import.meta.url = ${import.meta.url}`);
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;
const root = path.dirname(fileURLToPath(import.meta.url));
const xpackEnv = loadEnv(mode, root);
const port = 5889;
process.env.VITE_USE_MOCK = 'true';

if (!isTest) {
  console.log(root);
  startServer({
    root,
    isTest,
    port,
    baseUrl: xpackEnv.VITE_BASE_URL
  });
}
