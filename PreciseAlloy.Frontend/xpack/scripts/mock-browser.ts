import { setupWorker } from 'msw/browser';

import { handlers } from '../../src/mocks/handlers';

const worker = setupWorker(...handlers);

export { worker };
