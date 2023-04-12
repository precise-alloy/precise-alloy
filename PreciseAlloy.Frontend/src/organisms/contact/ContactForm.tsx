import Button from '@atoms/buttons/Button';
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
          <label htmlFor={name.inputName ?? 'inputName'}>{name.label}</label>

          <input required type={'text'} name={name.inputName ?? 'inputName'} id={name.inputName ?? 'inputName'} placeholder={name.placeHolder} />
        </div>

        <div className="zzz-o-contact-form__input-field">
          <label htmlFor={email.inputName ?? 'inputEmail'}>{email.label}</label>

          <input required type={'text'} name={email.inputName ?? 'inputEmail'} id={email.inputName ?? 'inputEmail'} placeholder={email.placeHolder} />
        </div>

        <div className="zzz-o-contact-form__input-field">
          <label htmlFor={message.inputName ?? 'inputMessage'}>{message.label}</label>

          <textarea
            required
            autoComplete="off"
            name={message.inputName ?? 'inputMessage'}
            id={message.inputName ?? 'inputMessage'}
            placeholder={message.placeHolder}
          />
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
