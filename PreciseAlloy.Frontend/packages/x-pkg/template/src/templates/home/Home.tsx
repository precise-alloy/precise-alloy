import { DemoModel } from '@_types/types';
import Demo from '@organisms/Demo';

interface Props {
  demo?: DemoModel;
}

const Home = (model: Props) => {
  const { demo } = model;

  return (
    <>
      <h2>Header</h2>

      <main>{demo && <Demo {...demo} />}</main>

      <h2>Footer</h2>
    </>
  );
};

export default Home;
