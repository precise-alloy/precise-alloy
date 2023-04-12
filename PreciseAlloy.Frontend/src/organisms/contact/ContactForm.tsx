import Button from '@atoms/buttons/Button';
import TextInput from '@atoms/text-inputs/TextInput';
import { getModifiers } from '@helpers/functions';
import RequireCss from '@helpers/RequireCss';
import { ContactFormModel } from '@_types/organisms';

const ContactForm = (model: ContactFormModel) => {
  const modifiers = getModifiers(model, 'zzz-o-contact-form');
  const { email, message, name, action, submitButton } = model;

  return (
    <>
      <form className={modifiers} action={action} method="POST">
        <div className="zzz-o-contact-form__input-field">
          <TextInput {...name} />
        </div>

        <div className="zzz-o-contact-form__input-field">
          <TextInput {...email} />
        </div>

        <div className="zzz-o-contact-form__input-field">
          <TextInput {...message} type="textarea" />
        </div>

        <div className="zzz-o-contact-form__submit-button">
          <Button type="submit" {...submitButton}></Button>
        </div>
      </form>

      <RequireCss path="b-contact-form" />
    </>
  );
};

export { ContactForm };
export default ContactForm;
