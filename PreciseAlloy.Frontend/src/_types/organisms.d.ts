type AvatarModel = BasedAtomicModel & {
  image: PictureModel;
  name: string;
  jobTitle: string;
};

type PeopleModel = BasedAtomicModel & {
  subHeader?: string;
  header?: string;
  text?: string;
  items?: AvatarModel[];
  button?: ButtonModel;
};

type PartnerModel = BasedAtomicModel & {
  button?: ButtonModel;
  label?: string;
  header?: SectionHeaderModel;
  description?: string;
  images?: PictureModel[];
};

type TeaserModel = BasedAtomicModel & {
  styleModifier?: 'image-left'[];
  button?: ButtonModel;
  header?: SectionHeaderModel;
  description?: string;
  image?: PictureModel;
};

type HeroModel = BasedAtomicModel & {
  button?: ButtonModel;
  label?: string;
  header?: SectionHeaderModel;
  description?: string;
  image?: PictureModel;
};

type FooterModel = BasedAtomicModel & {
  linkList?: LinkListWithIconModel;
  copyright?: string;
};

type HeaderModel = BasedAtomicModel & {
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
};

type PortfolioModel = BasedAtomicModel & {
  label?: string;
  header?: SectionHeaderModel;
  description?: string;
  images?: PictureModel[];
  button?: ButtonModel;
};

type PricesModel = BasedAtomicModel & {
  label?: string;
  header?: SectionHeaderModel;
  description?: string;
  items?: PriceModel[];
};

type ContactFormModel = BasedAtomicModel & {
  header?: SectionHeaderModel;
  name?: TextInputModel;
  email?: TextInputModel;
  message?: TextInputModel;
  submitButton: ButtonModel;
};

type ContactModel = BasedAtomicModel & {
  header?: SectionHeaderModel;
  description?: string;
  form?: ContactFormModel;
  map?: PictureModel;
};

type AlertModel = BasedAtomicModel & {
  heading?: string;
  items?: string[];
};

type EpiFormTextFieldModel = BasedAtomicModel & {
  id?: string;
  name?: string;
  label?: string;
  placeHolder?: string;
  required?: boolean;
  errorMessage?: string;
};

type EpiFormTextAreaModel = EpiFormTextFieldModel;

type EpiFormModel = BasedAtomicModel & {
  name?: EpiFormTextFieldModel;
  email?: EpiFormTextFieldModel;
  message?: EpiFormTextAreaModel;
  action?: string;
  submitButton: ButtonModel;
};
