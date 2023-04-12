import { ContactModel, FooterModel, HeaderModel } from '@_types/organisms';
import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import Contact from '@organisms/contact/Contact';

interface Props {
  header: HeaderModel;
  footer: FooterModel;
  contact?: ContactModel;
}

const ContactTemplate = (model: Props) => {
  const { header, footer, contact } = model;

  return (
    <>
      <Header {...header} />
      <main>{contact && <Contact {...contact} />}</main>
      <Footer {...footer} />
    </>
  );
};

export default ContactTemplate;
