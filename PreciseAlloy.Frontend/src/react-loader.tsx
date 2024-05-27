import { lazy } from 'react';
import { loadComponents } from '@tuyen-at-work/x-pkg/src/react-loader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blocks: { [name: string]: any } = {
  people: lazy(() => import('./organisms/people/People')),
  header: lazy(() => import('./organisms/header/Header')),
};

loadComponents(blocks);
window.addEventListener('load', () => loadComponents(blocks));
