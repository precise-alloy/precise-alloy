type LinkListWithIconModel = BasedAtomicModel & {
  items: LinkWithIconModel[];
};

type SectionHeaderModel = BasedAtomicModel & {
  heading: string;
  headingLevel?: string;
};

type PriceModel = BasedAtomicModel & {
  tag?: string;
  price?: {
    value?: string;
    time?: string;
  };
  info?: string;
  button?: ButtonModel;
  list?: ListModel;
};

type ItemModel = BasedAtomicModel & {
  text?: string;
  icon?: IconModel;
};

type ListModel = BasedAtomicModel & {
  items?: ItemModel[];
};
