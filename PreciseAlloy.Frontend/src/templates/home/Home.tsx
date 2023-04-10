import { HeroModel, PartnerModel, PeopleModel, TeaserModel } from '@_types/organisms';
import Partner from '@organisms/partner/Partner';
import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import Hero from '@organisms/hero/Hero';
import People from '@organisms/people/People';
import Teaser from '@organisms/teaser/Teaser';

interface Props {
  people?: PeopleModel;
  partner?: PartnerModel;
  teaser?: TeaserModel;
  teaserImageLeft?: TeaserModel;
  hero?: HeroModel;
}

const Home = (model: Props) => {
  const { people, partner, teaser, teaserImageLeft, hero } = model;

  return (
    <>
      <Header />
      <main>
        {hero && <Hero {...hero} />}
        {partner && <Partner {...partner} />}
        {teaser && <Teaser {...teaser} />}
        {teaserImageLeft && <Teaser {...teaserImageLeft} />}
        {people && <script data-rct="people" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(people) }}></script>}
      </main>
      <Footer />
    </>
  );
};

export default Home;
