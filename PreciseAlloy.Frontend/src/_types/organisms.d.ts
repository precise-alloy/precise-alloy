import { BasedAtomicModel } from "./_general";
import { ButtonModel, LinkWithIconModel, PictureModel } from "./atoms";

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
  title?: string;
  description?: string;
  images?: PictureModel[];
}

interface TeaserModel extends BasedAtomicModel {
  styleModifier?: ('image-left')[];
  button?: ButtonModel;
  title?: string;
  description?: string;
  image?: PictureModel;
}

interface HeroModel extends BasedAtomicModel {
  button?: ButtonModel;
  label?: string;
  title?: string;
  description?: string;
  image?: PictureModel;
}

interface FooterModel extends BasedAtomicModel {
  linkList?: LinkListWithIconModel;
  copyright?: string;
}

interface HeaderModel extends BasedAtomicModel {
  logo?: {
    src: string;
  };
  title?: string;
  navlinks?: {
    links: {
      text: string;
      url?: string;
    }[]

  }
}