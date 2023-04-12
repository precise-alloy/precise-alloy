import { getModifiers } from '@helpers/functions';
import { TextInputModel } from '@_types/atoms';

const TextInput = (model: TextInputModel) => {
  const { label, name, placeHolder, id, required, type } = model;
  const modifiers = getModifiers(model, 'zzz-a-text-input');

  return (
    <div className={modifiers}>
      <label htmlFor={id ?? name}>{label}</label>

      {type === 'textarea' ? (
        <textarea required={required} name={name} id={id ?? name} placeholder={placeHolder} />
      ) : (
        <input required={required} type={'text'} name={name} id={id ?? name} placeholder={placeHolder} />
      )}
    </div>
  );
};

export { TextInput };
export default TextInput;
