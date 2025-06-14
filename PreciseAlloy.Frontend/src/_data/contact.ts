import { ContactFormModel, ContactModel } from '@_types/organisms';
import { ContactFormResponseModel } from '@organisms/contact/contact-form';

const contact: ContactModel = {
  globalModifier: ['section-margin-top'],
  header: { heading: 'Contact Us', headingLevel: 'h1' },
  description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Test.',
  form: {
    name: { label: 'Name', name: 'inputName', id: 'idName', required: true },
    email: { label: 'Email', name: 'inputEmail', id: 'idEmail', required: true },
    message: { label: 'Message', name: 'inputMessage', id: 'idMessage', required: true },
    submitButton: {
      text: 'Submit',
    },
  },
  map: {
    src: '/samples/01.svg',
    width: '585',
    height: '328',
    alt: 'map',
  },
};

const contactForm: ContactFormModel = {
  globalModifier: ['section-margin-top'],
  name: {
    label: 'Name',
    name: 'inputName',
    id: 'idName',
    required: true,
    requiredMessage: 'This field is required.',
  },
  email: {
    label: 'Email',
    name: 'inputEmail',
    id: 'idEmail',
    required: true,
    requiredMessage: 'This field is required.',
    type: 'email',
  },
  message: {
    label: 'Message',
    name: 'inputMessage',
    id: 'idMessage',
  },
  submitButton: {
    text: 'Submit',
    styleModifier: ['btn-black'],
  },
  header: { heading: 'React Form' },
};

const contactFormSuccess: ContactFormResponseModel = {
  success: true,
  message: 'Thank you for your message. We will get back to you soon.',
};

const contactFormFailed: ContactFormResponseModel = {
  success: false,
  message: 'Something wrong please try again',
};

export { contact, contactForm, contactFormSuccess, contactFormFailed };
