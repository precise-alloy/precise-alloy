import { BasedAtomicModel } from './_general';

export interface ButtonModel extends BasedAtomicModel {
  disabled?: boolean;
  href?: string;
  link?: boolean;
  styleModifier?: ('btn' | 'btn-black')[];
  text: string;
  type?: 'button';
}

export interface PictureModel extends BasedAtomicModel {
  sources?: {
    media?: string;
    srcSet?: string;
  }[];
  src: string;
  alt?: string;
  lazy?: boolean;
}
