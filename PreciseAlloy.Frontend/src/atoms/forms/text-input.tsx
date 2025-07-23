import { getModifiers } from '@helpers/functions';
import { TextInputModel } from '@_types/atoms';
import { useFormContext } from 'react-hook-form';

import ErrorMessage from './error-message';

export interface FormValuesModel {
  [key: string]: string;
}

const TextInput = (model: TextInputModel) => {
  const { label, name, placeHolder, id, required, requiredMessage, type } = model;
  const modifiers = getModifiers(model, 'zzz-a-text-input');
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValuesModel>();

  return (
    <div className={modifiers}>
      <div className="zzz-a-text-input__group">
        <label htmlFor={id ?? name}>{label}</label>

        <input
          {...register(name || '', {
            required: required && requiredMessage,
          })}
          id={id}
          placeholder={placeHolder}
          type={type || 'text'}
        />
      </div>

      {name && errors[name]?.message && <ErrorMessage error={name && errors[name]?.message} />}
    </div>
  );
};

export { TextInput };
export default TextInput;
