import { FooterModel } from '@_types/organisms';
import Footer from '@organisms/footer';
import Header from '@organisms/header';

interface Props {
  footer: FooterModel;
}

const About = (model: Props) => {
  const { footer } = model;

  return (
    <>
      <Header />
      <main>
        <h1 className="zzz-container">About Page</h1>
      </main>
      <Footer {...footer} />
    </>
  );
};

export default About;
