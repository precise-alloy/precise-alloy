import { getModifiers } from '@helpers/functions';
import { ButtonModel } from '@_types/types';

const Button = (model: ButtonModel) => {
  const { href, link, text, type } = model;
  const styleModifiers = getModifiers(model, 'zzz-a-button');

  return link ? (
    <a href={href} className={styleModifiers}>
      {text}
    </a>
  ) : (
    <button type={type} className={styleModifiers}>
      {text}
    </button>
  );
};

export default Button;
