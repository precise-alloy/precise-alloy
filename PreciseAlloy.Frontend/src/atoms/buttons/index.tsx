import { getModifiers } from '@helpers/functions';
import { ButtonModel } from '@_types/types';

const Button = (model: ButtonModel) => {
  const { href, link, text, type, target } = model;
  const styleModifiers = getModifiers(model, 'zzz-a-button');

  return link ? (
    <a className={styleModifiers} href={href} target={target}>
      {text}
    </a>
  ) : (
    <button className={styleModifiers} type={type}>
      {text}
    </button>
  );
};

export default Button;
