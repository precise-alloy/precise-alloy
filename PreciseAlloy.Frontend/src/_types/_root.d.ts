type SinglePageNode = {
  type: 'single';
  name: string;
  path: string;

  component?: import('react').FC<any>;
};

type MultiplePageNode = {
  type: 'collection';
  name: string;
  items: SinglePageNode[];
  path: undefined;
};

type RootItemModel = SinglePageNode | MultiplePageNode;

type RootModel = {
  routes: RootItemModel[];
};
