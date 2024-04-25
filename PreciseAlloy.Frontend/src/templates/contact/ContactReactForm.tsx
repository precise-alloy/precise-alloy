import { ContactFormModel, FooterModel, HeaderModel } from '@_types/organisms';
import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import ReactSection from '@helpers/ReactSection';

interface Props {
  header: HeaderModel;
  footer: FooterModel;
  contactForm?: ContactFormModel;
}

const ContactReactFormTemplate = (model: Props) => {
  const { header, footer, contactForm } = model;

  return (
    <>
      <Header {...header} />
      <main>{contactForm && <ReactSection type="contactForm" data={contactForm} css={'b-contact-form'} />}</main>
      <Footer {...footer} />
    </>
  );
};

export default ContactReactFormTemplate;
