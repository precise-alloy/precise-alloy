import { hero } from '@data/hero';
import { partner } from '@data/partner';
import { people } from '@data/people';
import Template from '@templates/home/Home';

const Home = () => {
  return <Template people={people} partner={partner} hero={hero} />;
};

export default Home;
