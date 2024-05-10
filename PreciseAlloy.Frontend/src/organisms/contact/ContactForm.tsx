import Button from '@atoms/buttons/Button';
import { getModifiers } from '@helpers/functions';
import { ContactFormModel } from '@_types/organisms';
import SectionHeader from '@molecules/section-header/SectionHeader';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput, { FormValuesModel } from '@atoms/forms/TextInput';
import Textarea from '@atoms/forms/Textarea';
import { submitContactForm } from '@_api/contact-form';

export interface ContactFormResponseModel {
  success?: boolean;
  message?: string;
}

export interface ContactFormBodyRequestModel {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm = (model: ContactFormModel) => {
  const modifiers = getModifiers(model, 'zzz-o-contact-form');
  const { email, message, name, submitButton, header } = model;
  const methods = useForm<FormValuesModel>();
  const { handleSubmit, reset } = methods;

  const processSubmit = async (data: FormValuesModel) => {
    const nameValue = name && name.name && data[name.name];
    const emailValue = email && email.name && data[email.name];
    const messageValue = message && message.name && data[message.name];

    try {
      const response: ContactFormResponseModel = await submitContactForm({
        name: nameValue,
        email: emailValue,
        message: messageValue,
      });
      const { success, message } = response;

      if (success && message) {
        alert(message);

        reset();
      } else if (message) {
        throw new Error(message);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={modifiers}>
      <div className="zzz-container">
        {header && <SectionHeader {...header} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(processSubmit)}>
            {name && <TextInput {...name} />}

            {email && <TextInput {...email} />}

            {message && <Textarea {...message} />}

            {submitButton && <Button type="submit" {...submitButton}></Button>}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export { ContactForm };
export default ContactForm;
