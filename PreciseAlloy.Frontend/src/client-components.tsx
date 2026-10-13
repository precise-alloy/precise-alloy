import type { ClientComponents } from 'alveo';

import { lazy } from 'react';

export const clientComponents: ClientComponents = {
  people: lazy(() => import('./organisms/people')),
  header: lazy(() => import('./organisms/header')),
};
