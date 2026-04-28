import { createContext, useContext } from 'react';

export interface RootData {
  activeItem?: SinglePageNode;
  setActiveItem: (item?: SinglePageNode) => void;
  isTopPanel?: boolean;
  setTopPanel: (isTopPanel: boolean) => void;
  isRtl: boolean;
  setRtl: (value: boolean) => void;
}

export const RootContext = createContext<RootData>({
  setActiveItem: () => {
    // empty
  },
  setTopPanel: () => {
    // empty
  },
  isRtl: false,
  setRtl: () => {
    // empty
  },
});

export function useRootContext() {
  return useContext(RootContext);
}
