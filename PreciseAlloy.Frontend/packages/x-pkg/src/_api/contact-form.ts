import { ContactFormBodyRequestModel } from '@organisms/contact/ContactForm';
import { postAsync } from './_base';

const contactFormApiUrl = import.meta.env.VITE_APP_API_CONTACT_FORM_URL;

export const submitContactForm = (body: ContactFormBodyRequestModel) => {
  return postAsync(contactFormApiUrl, undefined, body);
};
