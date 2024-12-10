import { ButtonModel, IconModel, LinkWithIconModel } from './atoms';
import { BasedAtomicModel } from './_general';

export interface LinkListWithIconModel extends BasedAtomicModel {
  items: LinkWithIconModel[];
}

export interface SectionHeaderModel extends BasedAtomicModel {
  heading: string;
  headingLevel?: string;
}

export interface PriceModel extends BasedAtomicModel {
  tag?: string;
  price?: {
    value?: string;
    time?: string;
  };
  info?: string;
  button?: ButtonModel;
  list?: ListModel;
}

export interface ItemModel extends BasedAtomicModel {
  text?: string;
  icon?: IconModel;
}

export interface ListModel extends BasedAtomicModel {
  items?: ItemModel[];
}
