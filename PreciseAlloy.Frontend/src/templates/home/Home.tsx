import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import Hero from '@organisms/hero/Hero';
import People from '@organisms/people/People';
import Teaser from '@organisms/teaser/Teaser';

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Teaser />
        <People />
      </main>
      <Footer />
    </>
  );
};

export default Home;
