import { RootModel } from '@_types/types';
import Template from '@templates/root/Root';

const Root = (model: RootModel) => {
  return <Template {...model} />;
};

export default Root;
