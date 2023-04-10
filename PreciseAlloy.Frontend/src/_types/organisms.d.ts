import { BasedAtomicModel } from './_general';
import { ButtonModel, PictureModel } from './atoms';

interface PartnerModel extends BasedAtomicModel {
  button?: ButtonModel;
  label?: string;
  title?: string;
  description?: string;
  images?: PictureModel[];
}

interface HeroModel extends BasedAtomicModel {
  button?: ButtonModel;
  label?: string;
  title?: string;
  description?: string;
  image?: PictureModel;
}