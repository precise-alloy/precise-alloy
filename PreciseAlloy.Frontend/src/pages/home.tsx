import { footer } from '@data/footer';
import { header } from '@data/header';
import { hero } from '@data/hero';
import { partner } from '@data/partner';
import { people } from '@data/people';
import { teaser, teaserImageLeft } from '@data/teaser';
import Template from '@templates/home';

const Home = () => {
  return <Template footer={footer} header={header} hero={hero} partner={partner} people={people} teaser={teaser} teaserImageLeft={teaserImageLeft} />;
};

export default Home;
