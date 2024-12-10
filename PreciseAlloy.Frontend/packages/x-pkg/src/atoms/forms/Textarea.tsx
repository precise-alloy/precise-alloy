import { getModifiers } from '@helpers/functions';
import { TextareaModel } from '@_types/atoms';
import { useFormContext } from 'react-hook-form';
import { FormValuesModel } from './TextInput';
import ErrorMessage from './ErrorMessage';

const Textarea = (model: TextareaModel) => {
  const { label, name, placeHolder, id, required, requiredMessage } = model;
  const modifiers = getModifiers(model, 'zzz-a-textarea');
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValuesModel>();

  return (
    <div className={modifiers}>
      <div className="zzz-a-textarea__group">
        <label htmlFor={id ?? name}>{label}</label>

        <textarea
          {...register(name || '', {
            required: required && requiredMessage,
          })}
          placeholder={placeHolder}
          id={id}
        />
      </div>

      {name && errors[name]?.message && <ErrorMessage error={name && errors[name]?.message} />}
    </div>
  );
};

export { Textarea };
export default Textarea;
