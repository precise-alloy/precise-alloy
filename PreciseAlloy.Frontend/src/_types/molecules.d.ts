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
  price?: string;
  info?: string;
  button?: ButtonModel;
}

export interface ItemWithIconModel extends BasedAtomicModel {
  text?: string;
  icon?: IconModel;
}

export interface ListWithIconModel extends BasedAtomicModel {
  items?: ItemWithIconModel[];
}
