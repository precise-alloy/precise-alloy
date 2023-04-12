import { footer } from '@data/footer';
import { prices } from '@data/prices';
import ServiceTemplate from '@templates/service/Service';

const Service = () => {
  return <ServiceTemplate footer={footer} prices={prices} />;
};

export default Service;
