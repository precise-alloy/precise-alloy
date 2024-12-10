import { SinglePageNode } from '@_types/types';
import { createContext, useContext } from 'react';

export interface RootData {
  activeItem?: SinglePageNode;
  setActiveItem: (item?: SinglePageNode) => void;
  isTopPanel?: boolean;
  setTopPanel: (isTopPanel: boolean) => void;
}

export const RootContext = createContext<RootData>({
  setActiveItem: () => {
    // empty
  },
  setTopPanel: () => {
    // empty
  },
});

export function useRootContext() {
  return useContext(RootContext);
}
