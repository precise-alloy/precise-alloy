import { BasedAtomicModel } from './_general';
import { ButtonModel, PictureModel, TextInputModel } from './atoms';
import { PriceModel, SectionHeaderModel } from './molecules';

export interface AvatarModel extends BasedAtomicModel {
  image: PictureModel;
  name: string;
  jobTitle: string;
}

export interface PeopleModel extends BasedAtomicModel {
  subHeader?: string;
  header?: string;
  text?: string;
  items?: AvatarModel[];
  button?: ButtonModel;
}

interface PartnerModel extends BasedAtomicModel {
  button?: ButtonModel;
  label?: string;
  header?: SectionHeaderModel;
  description?: string;
  images?: PictureModel[];
}

interface TeaserModel extends BasedAtomicModel {
  styleModifier?: 'image-left'[];
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
    }[];
  };
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
  header?: SectionHeaderModel;
  name?: TextInputModel;
  email?: TextInputModel;
  message?: TextInputModel;
  submitButton?: ButtonModel;
}

interface ContactModel extends BasedAtomicModel {
  header?: SectionHeaderModel;
  description?: string;
  form?: ContactFormModel;
  map?: PictureModel;
}

interface AlertModel extends BasedAtomicModel {
  heading?: string;
  items?: string[];
}

interface EpiFormTextFieldModel extends BasedAtomicModel {
  id?: string;
  name?: string;
  label?: string;
  placeHolder?: string;
  required?: boolean;
  errorMessage?: string;
}

type EpiFormTextAreaModel = EpiFormTextFieldModel;

interface EpiFormModel extends BasedAtomicModel {
  name?: EpiFormTextFieldModel;
  email?: EpiFormTextFieldModel;
  message?: EpiFormTextAreaModel;
  action?: string;
  submitButton: ButtonModel;
}
