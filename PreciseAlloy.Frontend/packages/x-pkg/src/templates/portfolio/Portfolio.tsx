import { FooterModel, HeaderModel, PortfolioModel } from '@_types/organisms';
import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import Portfolio from '@organisms/portfolio/Portfolio';

interface Props {
  footer: FooterModel;
  portfolio?: PortfolioModel;
  header?: HeaderModel;
}

const PortfolioTemplate = (model: Props) => {
  const { footer, portfolio, header } = model;

  return (
    <>
      {header && <Header {...header} />}

      <main>{portfolio && <Portfolio {...portfolio} />}</main>

      <Footer {...footer} />
    </>
  );
};

export default PortfolioTemplate;
