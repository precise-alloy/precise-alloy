import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import serveStatic from 'serve-static';
import { ViteDevServer, loadEnv } from 'vite';
import { createViteDevServer } from './create-vite-dev-server.js';
import { useRenderer } from './renderer.js';
import chalk from 'chalk';
import { IncomingMessage, Server, ServerResponse } from "http";

interface Props {
  root: string;
  isTest: boolean;
  port: number;
  hmrPort?: number;
  baseUrl?: string;
}

const argvModeIndex = process.argv.indexOf('--mode');
const mode = argvModeIndex >= 0 && argvModeIndex < process.argv.length - 1 && !process.argv[argvModeIndex + 1].startsWith('-') ? process.argv[argvModeIndex + 1] : 'production';
process.env.MY_CUSTOM_SECRET = 'API_KEY_4c2928b5a14b475d94c3579cbea06178';
const isProd = process.env.NODE_ENV === 'production';

const createServer = async ({ root, hmrPort, baseUrl, isTest }: Props) => {
  const resolve = (p: string) => path.join(root, p);

  const indexProd = isProd ? fs.readFileSync(resolve('index.html'), 'utf-8') : '';

  const app = express();

  let viteDevServer: ViteDevServer | undefined;
  if (!isProd) {
    viteDevServer = await createViteDevServer({ root, baseUrl, hmrPort, isTest });
    // use vite's connect instance as middleware
    app.use(viteDevServer.middlewares);
  }

  app.use('/assets/images', serveStatic(resolve('public/assets/images'), { index: false }));
  app.use('/assets/fonts', serveStatic(resolve('public/assets/fonts'), { index: false }));
  app.use('/assets/css', serveStatic(resolve('public/assets/css'), { index: false }));
  app.use('/assets/js', serveStatic(resolve('public/assets/js'), { index: false }));
  app.use('/assets/vendors', serveStatic(resolve('public/assets/vendors'), { index: false }));
  app.use('/assets', serveStatic(resolve('dist/assets'), { index: false }));
  app.use('/samples', serveStatic(resolve('public/samples'), { index: false }));

  useRenderer({ app, indexProd, isProd, viteDevServer, resolve });

  return { app, viteDevServer };
};

const startServer = (props: Props) => {
  createServer(props).then(async ({ app, viteDevServer }) => {
    let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

    try {
      server = app.listen(props.port, () => {
        const xpackEnv = loadEnv(mode, props.root);
        console.log('Running on ' + chalk.green('http://localhost:' + props.port + xpackEnv.VITE_BASE_URL));
      });
    } catch (error: any) {
      if (error.code === 'EADDRINUSE') {
        console.log(chalk.green('\n--- Try to run on another port ---\n'));

        server?.close();

        await viteDevServer?.close();

        const newPort = props.port + 2; // Skipping the next 2 port numbers since our application is using two consecutive numbers for the dev server and the hrm

        startServer({ ...props, port: newPort, ...(props.hmrPort && { hmrPort: newPort + 1 }) });
      }
    }
  });
};

export { startServer };
