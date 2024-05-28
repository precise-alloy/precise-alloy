import { DemoModel } from '@_types/organisms';
import { getModifiers } from '@helpers/functions';

const Demo = (model: DemoModel) => {
  const { title } = model;
  const styleModifiers = getModifiers(model, 'zzz-o-demo');

  return (
    <div className={styleModifiers}>
      <h2>{title}</h2>
    </div>
  );
};

export default Demo;
