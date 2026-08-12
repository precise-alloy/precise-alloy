import { lazy } from 'react';
import type { ClientComponents } from 'alveo';

export const clientComponents: ClientComponents = {
  people: lazy(() => import('./organisms/people')),
  header: lazy(() => import('./organisms/header')),
};
