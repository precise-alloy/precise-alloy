import { footer } from '@data/footer';
import { portfolio } from '@data/portfolio';
import PortfolioTemplate from '@templates/portfolio/Portfolio';
import { header } from '@data/header';

const Portfolio = () => {
  return <PortfolioTemplate footer={footer} header={header} portfolio={portfolio} />;
};

export default Portfolio;
