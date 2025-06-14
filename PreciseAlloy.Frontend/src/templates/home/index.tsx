import { HeroModel, PartnerModel, PeopleModel, TeaserModel, FooterModel, HeaderModel } from '@_types/organisms';
import Partner from '@organisms/partner';
import Footer from '@organisms/footer';
import Hero from '@organisms/hero';
import Teaser from '@organisms/teaser';
import Header from '@organisms/header';
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
        {people && <ReactSection type="people" data={people} css={'b-people'} />}
      </main>
      <Footer {...footer} />
    </>
  );
};

export default Home;
