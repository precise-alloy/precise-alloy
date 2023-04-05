import { fileURLToPath } from 'node:url';
import path from 'path';
import { startServer } from './xserver/create-server.js';

console.log('[INIT] server');
console.log(`import.meta.url = ${import.meta.url}`);
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;
const root = path.dirname(fileURLToPath(import.meta.url));
const port = 5889;
process.env.VITE_USE_MOCK = 'true';

if (!isTest) {
  console.log(root);
  startServer({
    root,
    isTest,
    port,
  });
}
