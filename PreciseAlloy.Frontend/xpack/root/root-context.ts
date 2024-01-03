import { RootItemModel } from '@_types/types';
import { createContext, useContext } from 'react';

export interface RootData {
  activeItem?: RootItemModel;
  setActiveItem: (item?: RootItemModel) => void;
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

export const useRootContext = () => useContext(RootContext);
