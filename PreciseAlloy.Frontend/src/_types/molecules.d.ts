import { LinkWithIconModel } from './atoms';
import { BasedAtomicModel } from './_general';

export interface LinkListWithIconModel extends BasedAtomicModel {
  items: LinkWithIconModel[];
}

export interface SectionHeaderModel extends BasedAtomicModel {
  heading: string;
  headingLevel?: string;
}
