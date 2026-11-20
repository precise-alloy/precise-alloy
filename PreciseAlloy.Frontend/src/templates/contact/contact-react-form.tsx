import Footer from '@organisms/footer';
import Header from '@templates/header';

interface Props {
  header: HeaderModel;
  footer: FooterModel;
  contactForm?: ContactFormModel;
}

const ContactReactFormTemplate = (model: Props) => {
  const { header, footer } = model;

  return (
    <>
      <Header {...header} />
      <Footer {...footer} />
    </>
  );
};

export default ContactReactFormTemplate;
