import { FooterModel, PricesModel } from '@_types/organisms';
import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import Prices from '@organisms/prices/Prices';

interface Props {
  footer: FooterModel;
  prices?: PricesModel;
}

const ServiceTemplate = (model: Props) => {
  const { footer, prices } = model;

  return (
    <>
      <Header />
      <main>{prices && <Prices {...prices} />}</main>
      <Footer {...footer} />
    </>
  );
};

export default ServiceTemplate;
