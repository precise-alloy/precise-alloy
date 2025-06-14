import { FooterModel, HeaderModel, PortfolioModel } from '@_types/organisms';
import Footer from '@organisms/footer';
import Header from '@organisms/header';
import Portfolio from '@organisms/portfolio';

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
