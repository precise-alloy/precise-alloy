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

export interface IconModel extends BasedAtomicModel {
  iconPath: string;
  viewBoxWidth: number;
  viewBoxHeight: number;
  width?: number;
  height?: number;
}

export interface LinkWithIconModel extends BasedAtomicModel {
  url: string;
  icon: IconModel;
  target?: string;
}
