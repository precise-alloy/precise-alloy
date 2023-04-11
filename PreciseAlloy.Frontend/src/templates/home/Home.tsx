import { FooterModel, HeroModel, PartnerModel, PeopleModel } from '@_types/organisms';
import Partner from '@organisms/Partner/Partner';
import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import Hero from '@organisms/hero/Hero';
import People from '@organisms/people/People';
import Teaser from '@organisms/teaser/Teaser';

interface Props {
  people?: PeopleModel;
  partner?: PartnerModel;
  hero?: HeroModel;
  footer: FooterModel;
}

const Home = (model: Props) => {
  const { people, partner, hero, footer } = model;

  return (
    <>
      <Header />
      <main>
        {hero && <Hero {...hero} />}
        {partner && <Partner {...partner} />}
        <Teaser />
        {people && <script data-rct="people" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(people) }}></script>}
      </main>
      <Footer {...footer} />
    </>
  );
};

export default Home;
