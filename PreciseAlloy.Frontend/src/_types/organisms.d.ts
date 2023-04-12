import { BasedAtomicModel } from "./_general";
import { ButtonModel, LinkWithIconModel, PictureModel, TextInputModel } from "./atoms";
import { PriceModel, SectionHeaderModel } from "./molecules";

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

interface PortfolioModel extends BasedAtomicModel {
  label?: string;
  header?: SectionHeaderModel;
  description?: string;
  images?: PictureModel[];
  button?: ButtonModel;
}

interface PricesModel extends BasedAtomicModel {
  label?: string;
  header?: SectionHeaderModel;
  description?: string;
  items?: PriceModel[];
}

interface ContactFormModel extends BasedAtomicModel {
  name: TextInputModel;
  email: TextInputModel;
  message: TextInputModel;
  action?: string;
  submitButton: ButtonModel;
}

interface ContactModel extends BasedAtomicModel {
  header?: SectionHeaderModel;
  description?: string;
  form?: ContactFormModel;
  map?: { placeholderSrc?: string }
}