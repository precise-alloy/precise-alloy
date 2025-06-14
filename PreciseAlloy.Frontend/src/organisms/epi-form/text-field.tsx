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
        className="FormTextbox__Input"
        required={required}
        type={'text'}
        name={name}
        id={id ?? name}
        placeholder={placeHolder}
        autoComplete="off"
      />

      <span className="Form__Element__ValidationError"> {errorMessage}</span>
    </div>
  );
};

export { TextField };
