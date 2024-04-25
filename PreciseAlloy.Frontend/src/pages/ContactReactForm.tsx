import { contactForm } from '@data/contact';
import { footer } from '@data/footer';
import { header } from '@data/header';
import ContactReactFormTemplate from '@templates/contact/ContactReactForm';

const Portfolio = () => {
  return <ContactReactFormTemplate header={header} footer={footer} contactForm={contactForm} />;
};

export default Portfolio;
