import { AlertModel, ContactModel, FooterModel, HeaderModel } from '@_types/organisms';
import Footer from '@organisms/footer/Footer';
import Header from '@organisms/header/Header';
import Contact from '@organisms/contact/Contact';
import Alert from '@organisms/alert/Alert';

interface Props {
  header: HeaderModel;
  footer: FooterModel;
  contact?: ContactModel;
  alert?: AlertModel;
}

const ContactTemplate = (model: Props) => {
  const { header, footer, contact, alert } = model;

  return (
    <>
      {alert && <Alert {...alert} />}
      <Header {...header} />
      <main>{contact && <Contact {...contact} />}</main>
      <Footer {...footer} />
    </>
  );
};

export default ContactTemplate;
