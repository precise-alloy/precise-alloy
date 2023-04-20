import { alert } from '@data/alert';
import { contact } from '@data/contact';
import { footer } from '@data/footer';
import { header } from '@data/header';
import ContactTemplate from '@templates/contact/Contact';

const Portfolio = () => {
  return <ContactTemplate header={header} footer={footer} contact={contact} alert={alert} />;
};

export default Portfolio;
