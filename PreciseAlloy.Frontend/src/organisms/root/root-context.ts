import { RootItemModel } from '@_types/types';
import { createContext, useContext } from 'react';

export interface RootData {
  activeItem?: RootItemModel;
  setActiveItem: (item?: RootItemModel) => any;
  isTopPanel?: boolean;
  setTopPanel: (isTopPanel: boolean) => any;
}

export const RootContext = createContext<RootData>({
  setActiveItem: () => {},
  setTopPanel: () => {},
});

export const useRootContext = () => useContext(RootContext);
