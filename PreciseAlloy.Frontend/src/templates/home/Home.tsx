import { HeroModel, PartnerModel, PeopleModel, TeaserModel, FooterModel } from '@_types/organisms';
import Partner from '@organisms/partner/Partner';
import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import Hero from '@organisms/hero/Hero';
import Teaser from '@organisms/teaser/Teaser';

interface Props {
  people?: PeopleModel;
  partner?: PartnerModel;
  teaser?: TeaserModel;
  teaserImageLeft?: TeaserModel;
  hero?: HeroModel;
  footer: FooterModel;
}

const Home = (model: Props) => {
  const { people, partner, teaser, teaserImageLeft, hero, footer } = model;

  return (
    <>
      <Header />
      <main>
        {hero && <Hero {...hero} />}
        {partner && <Partner {...partner} />}
        {teaserImageLeft && <Teaser {...teaserImageLeft} />}
        {teaser && <Teaser {...teaser} />}
        {people && <script data-rct="people" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(people) }}></script>}
      </main>
      <Footer {...footer} />
    </>
  );
};

export default Home;
