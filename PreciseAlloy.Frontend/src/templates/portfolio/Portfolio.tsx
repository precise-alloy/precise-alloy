import { FooterModel, PortfolioModel } from '@_types/organisms';
import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import Portfolio from '@organisms/portfolio/Portfolio';

interface Props {
  footer: FooterModel;
  portfolio?: PortfolioModel;
}

const PortfolioTemplate = (model: Props) => {
  const { footer, portfolio } = model;

  return (
    <>
      <Header />
      <main>{portfolio && <Portfolio {...portfolio} />}</main>
      <Footer {...footer} />
    </>
  );
};

export default PortfolioTemplate;
