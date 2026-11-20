import Footer from '@organisms/footer';
import Header from '@templates/header';
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
