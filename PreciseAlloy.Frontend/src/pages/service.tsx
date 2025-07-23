import { footer } from '@data/footer';
import { prices } from '@data/prices';
import ServiceTemplate from '@templates/service';
import { header } from '@data/header';

const Service = () => {
  return <ServiceTemplate footer={footer} header={header} prices={prices} />;
};

export default Service;
