import { ViteDevServer, createServer } from 'vite';

interface Props {
  root: string;
  baseUrl?: string;
  isTest: boolean;
  hmrPort?: number;
}

const createViteDevServer = ({ root, baseUrl, hmrPort, isTest }: Props): Promise<ViteDevServer> => {
  const server = createServer({
    root,
    base: baseUrl,
    logLevel: isTest ? 'error' : 'info',
    server: {
      middlewareMode: true,
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 200,
      },
      hmr: {
        port: hmrPort,
      },
    },
    appType: 'custom',
  });

  return server;
};

export { createViteDevServer };
