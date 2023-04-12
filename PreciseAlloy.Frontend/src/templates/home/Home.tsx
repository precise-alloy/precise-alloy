import { HeroModel, PartnerModel, PeopleModel, TeaserModel, FooterModel, HeaderModel } from '@_types/organisms';
import Partner from '@organisms/partner/Partner';
import Footer from '@organisms/footer/Footer';
import Hero from '@organisms/hero/Hero';
import Teaser from '@organisms/teaser/Teaser';
import RequireCss from '@helpers/RequireCss';
import Header from '@organisms/header/Header';

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
        {people && <script data-rct="people" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(people) }}></script>}
        <RequireCss path="b-people" />
      </main>
      <Footer {...footer} />
    </>
  );
};

export default Home;
