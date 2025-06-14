import { getModifiers } from '@helpers/functions';
import { ButtonModel } from '@_types/atoms';

const Button = (model: ButtonModel) => {
  const { text, type } = model;
  const styleModifiers = getModifiers(model, 'FormSubmitButton');

  return (
    <button className={styleModifiers} type={type}>
      {text}
    </button>
  );
};

export { Button };
