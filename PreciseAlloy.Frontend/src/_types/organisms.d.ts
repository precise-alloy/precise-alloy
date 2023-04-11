import { BasedAtomicModel } from "./_general";
import { ButtonModel, LinkWithIconModel, PictureModel } from "./atoms";
import { SectionHeaderModel } from "./molecules";

export interface AvatarModel extends BasedAtomicModel {
  src: string;
  name: string;
  jobTitle: string;
}

export interface PeopleModel extends BasedAtomicModel {
  subHeader?: string;
  header?: string;
  text?: string;
  items?: AvatarModel[]
}

interface PartnerModel extends BasedAtomicModel {
  button?: ButtonModel;
  label?: string;
  header?: SectionHeaderModel;
  description?: string;
  images?: PictureModel[];
}

interface TeaserModel extends BasedAtomicModel {
  styleModifier?: ('image-left')[];
  button?: ButtonModel;
  header?: SectionHeaderModel;
  description?: string;
  image?: PictureModel;
}

interface HeroModel extends BasedAtomicModel {
  button?: ButtonModel;
  label?: string;
  header?: SectionHeaderModel;
  description?: string;
  image?: PictureModel;
}

interface FooterModel extends BasedAtomicModel {
  linkList?: LinkListWithIconModel;
  copyright?: string;
}

interface PortfolioModel extends BasedAtomicModel {
  label?: string;
  header?: SectionHeaderModel;
  description?: string;
  images?: PictureModel[];
  button?: ButtonModel;
}