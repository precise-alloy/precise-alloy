import { worker } from '@mocks/browser';

worker.start({
  serviceWorker: {
    url: `${import.meta.env.VITE_BASE_URL}mockServiceWorker.js`,
    options: {
      scope: `${import.meta.env.VITE_BASE_URL}`,
    },
  },
  onUnhandledRequest: 'bypass',
});
