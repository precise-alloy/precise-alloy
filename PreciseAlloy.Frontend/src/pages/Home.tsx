import { footer } from '@data/footer';
import { hero } from '@data/hero';
import { partner } from '@data/partner';
import { people } from '@data/people';
import { teaser, teaserImageLeft } from '@data/teaser';
import Template from '@templates/home/Home';

const Home = () => {
  return <Template people={people} partner={partner} teaser={teaser} teaserImageLeft={teaserImageLeft} hero={hero} footer={footer} />;
};

export default Home;
