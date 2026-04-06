type ButtonModel = BasedAtomicModel & {
  disabled?: boolean;
  href?: string;
  link?: boolean;
  styleModifier?: ('btn' | 'btn-black')[];
  text: string;
  type?: 'button' | 'submit';
  target?: string;
};

type PictureModel = BasedAtomicModel & {
  sources?: {
    media?: string;
    srcSet?: string;
  }[];
  src: string;
  alt?: string;
  lazy?: boolean;
  width?: string;
  height?: string;
};

type IconModel = BasedAtomicModel & {
  iconPath: string;
  viewBoxWidth: number;
  viewBoxHeight: number;
  width?: number;
  height?: number;
};

type LinkWithIconModel = BasedAtomicModel & {
  url: string;
  icon: IconModel;
  target?: string;
  ariaLabel?: string;
  text?: string;
};

type TextInputModel = BasedAtomicModel & {
  id?: string;
  name?: string;
  label?: string;
  placeHolder?: string;
  required?: boolean;
  requiredMessage?: string;
  type?: 'text' | 'email' | 'password';
};

type TextareaModel = BasedAtomicModel & {
  id?: string;
  name?: string;
  label?: string;
  placeHolder?: string;
  required?: boolean;
  requiredMessage?: string;
};

type ErrorMessageModel = BasedAtomicModel & {
  error?: string;
};
