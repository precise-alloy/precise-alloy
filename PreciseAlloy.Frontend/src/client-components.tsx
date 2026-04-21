import { lazy } from 'react';

export const clientComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  people: lazy(() => import('./organisms/people')),
  header: lazy(() => import('./organisms/header')),
};
