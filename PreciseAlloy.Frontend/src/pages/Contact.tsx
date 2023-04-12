import { contact } from '@data/contact';
import { footer } from '@data/footer';
import { header } from '@data/header';
import { portfolio } from '@data/portfolio';
import ContactTemplate from '@templates/contact/Contact';
import PortfolioTemplate from '@templates/portfolio/Portfolio';

const Portfolio = () => {
  return <ContactTemplate header={header} footer={footer} contact={contact} />;
};

export default Portfolio;
