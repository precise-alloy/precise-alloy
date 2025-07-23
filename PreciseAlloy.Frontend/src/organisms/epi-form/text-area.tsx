import { getModifiers } from '@helpers/functions';
import { EpiFormTextAreaModel } from '@_types/organisms';

const TextArea = (model: EpiFormTextAreaModel) => {
  const { label, name, placeHolder, id, required, errorMessage } = model;
  const modifiers = getModifiers(model, 'Form__Element FormTextbox');

  return (
    <div className={modifiers}>
      <label className="Form__Element__Caption" htmlFor={id ?? name}>
        {label}
      </label>

      <textarea autoComplete="off" className="FormTextbox__Input" id={id ?? name} name={name} placeholder={placeHolder} required={required} />

      <span className="Form__Element__ValidationError"> {errorMessage}</span>
    </div>
  );
};

export { TextArea };
