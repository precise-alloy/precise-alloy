import { ContactFormBodyRequestModel } from '@organisms/contact/contact-form';

const contactFormApiUrl = import.meta.env.VITE_APP_API_CONTACT_FORM_URL;

export const submitContactForm = (body: ContactFormBodyRequestModel) => {
  return window.appApi.postAsync(contactFormApiUrl, undefined, body);
};
