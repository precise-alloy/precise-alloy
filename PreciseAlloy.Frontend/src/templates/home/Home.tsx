import { PartnerModel } from '@_types/organisms';
import Partner from '@organisms/Partner/Partner';
import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import Hero from '@organisms/hero/Hero';
import People from '@organisms/people/People';
import Teaser from '@organisms/teaser/Teaser';

interface Props {
  partner?: PartnerModel;
}

const Home = ({ partner }: Props) => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {partner && <Partner {...partner} />}
        <Teaser />
        <People />
      </main>
      <Footer />
    </>
  );
};

export default Home;
