import { BasedAtomicModel } from './_general';

export interface ButtonModel extends BasedAtomicModel {
  disabled?: boolean;
  href?: string;
  link?: boolean;
  styleModifier?: ('btn' | 'bg-flow' | 'bg-white' | 'btn-white' | 'btn-wave' | 'btn-pearl-s' | 'btn-filter' | 'btn-sm' | 'uppercase')[];
  text: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface PictureModel extends BasedAtomicModel {
  styleModifier?: 'as-background'[];
  sources?: {
    media?: string;
    srcSet?: string;
  }[];
  src: string;
  alt?: string;
}

export interface SpinnerModel extends BasedAtomicModel {
  styleModifier?: 'white'[];
}

export interface WistiaVideoModel extends BasedAtomicModel {
  videoId: string;
  isPopover?: boolean;
  autoPlay?: boolean;
  stillUrl?: string;
  noScript?: boolean;
}
/* ----------- END: atoms ---------- */
export interface IconModel {
  styleModifier?: ('ul' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 's' | 'xs' | 'xxs' | 'with-bg' | 'arrow-down' | 'initial')[];
  iconPath: string;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => any;
}

export interface IconWithBgModel {
  styleModifier?: ('ul' | 'xxl' | 'xl' | 'lg' | 'sm' | 's' | 'xs' | 'xxs' | 'bg-pearl-s' | 'bg-pebble-s' | 'bg-white-p')[];
  iconPath: string;
  className?: string;
}

export interface LinkModel {
  styleModifier?: ('text-lava' | 'bg-sand' | 'animation-on-hover' | 'current' | 'duplicate' | 'large' | 'underline')[];
  url: string;
  text: string;
  disabled?: boolean;
  active?: boolean;
  menuId?: string;
  dataParams?: string;
}

export interface AutoCompleteModel {
  label: string;
  placeHolder?: string;
  apiUrl: string;
  redirectUrl: string;
  isNoWrapper: boolean;
  resultsListDestination: string;
}
export interface RadioModel extends BasedAtomicModel {
  value: string;
  name: string;
  label: string;
  checked?: boolean;
  id: string;
  styleModifier?: string[];
  handleValueChange?: ChangeEventHandler;
}

export interface HamburgerModel extends BasedAtomicModel {
  styleModifier?: string[];
}

export interface OptionModel extends BasedAtomicModel {
  value?: string;
  option?: string;
  selected?: boolean;
}

export interface SelectModel extends BasedAtomicModel {
  name?: string;
  selectOptions?: OptionModel[];
}

export interface StatusModel extends BasedAtomicModel {
  tooltip?: string;
  code?: string;
  description?: string;
}

export interface FacetItemModel extends BasedAtomicModel {
  value: string;
  text: string;
  checked?: boolean;
  filterCounter?: number | string;
  iconClass?: string;
  multiChoice?: boolean;
}

export interface PictureWithZoomModel extends BasedAtomicModel {
  imgUrl: string;
  rateZoom?: number;
}

export interface LogoModel extends BasedAtomicModel {
  src?: string;
  url?: string;
  title?: string;
}
