import { getModifiers } from '@helpers/functions';
import { EpiFormTextFieldModel } from '@_types/organisms';

const TextField = (model: EpiFormTextFieldModel) => {
  const { label, name, placeHolder, id, required, errorMessage } = model;
  const modifiers = getModifiers(model, 'Form__Element FormTextbox');

  return (
    <div className={modifiers}>
      <label className="Form__Element__Caption" htmlFor={id ?? name}>
        {label}
      </label>

      <input
        autoComplete="off"
        className="FormTextbox__Input"
        id={id ?? name}
        name={name}
        placeholder={placeHolder}
        required={required}
        type={'text'}
      />

      <span className="Form__Element__ValidationError"> {errorMessage}</span>
    </div>
  );
};

export { TextField };
