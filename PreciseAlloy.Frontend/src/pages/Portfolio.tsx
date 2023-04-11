import { footer } from '@data/footer';
import { portfolio } from '@data/portfolio';
import PortfolioTemplate from '@templates/portfolio/Portfolio';

const Portfolio = () => {
  return <PortfolioTemplate footer={footer} portfolio={portfolio} />;
};

export default Portfolio;
