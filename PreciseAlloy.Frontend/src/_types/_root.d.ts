import { FC } from 'react';

export interface SinglePageNode {
  type: 'single';
  name: string;
  path: string;

  component?: FC<any>;
}

export interface MultiplePageNode {
  type: 'collection';
  name: string;
  items: SinglePageNode[];
  path: undefined;
}

export type RootItemModel = SinglePageNode | MultiplePageNode;

export interface RootModel {
  routes: RootItemModel[];
}
