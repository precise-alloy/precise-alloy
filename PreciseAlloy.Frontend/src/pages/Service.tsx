import { footer } from '@data/footer';
import { prices } from '@data/prices';
import ServiceTemplate from '@templates/service/Service';
import { header } from '@data/header';

const Service = () => {
  return <ServiceTemplate header={header} footer={footer} prices={prices} />;
};

export default Service;
