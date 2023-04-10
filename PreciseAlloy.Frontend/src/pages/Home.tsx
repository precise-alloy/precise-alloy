import { hero } from '@data/hero';
import { partner } from '@data/partner';
import Template from '@templates/home/Home';

const Home = () => {
  return <Template partner={partner} hero={hero} />;
};

export default Home;
