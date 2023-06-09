import { HeroModel, PartnerModel, PeopleModel, TeaserModel, FooterModel, HeaderModel } from '@_types/organisms';
import Partner from '@organisms/partner/Partner';
import Footer from '@organisms/footer/Footer';
import Hero from '@organisms/hero/Hero';
import Teaser from '@organisms/teaser/Teaser';
import Header from '@organisms/header/Header';
import ReactSection from '@helpers/ReactSection';

interface Props {
  people?: PeopleModel;
  partner?: PartnerModel;
  teaser?: TeaserModel;
  teaserImageLeft?: TeaserModel;
  hero?: HeroModel;
  header?: HeaderModel;
  footer?: FooterModel;
}

const Home = (model: Props) => {
  const { people, partner, teaser, teaserImageLeft, hero, header, footer } = model;

  return (
    <>
      {header && <Header {...header} />}

      <main>
        {hero && <Hero {...hero} />}
        {partner && <Partner {...partner} />}
        {teaserImageLeft && <Teaser {...teaserImageLeft} />}
        {teaser && <Teaser {...teaser} />}
        {people && <ReactSection type='people' data={people} css={'b-people'} />}
      </main>
      <Footer {...footer} />
    </>
  );
};

export default Home;
