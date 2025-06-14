import { AlertModel, ContactModel, FooterModel, HeaderModel } from '@_types/organisms';
import Footer from '@organisms/footer';
import Header from '@organisms/header';
import Contact from '@organisms/contact/Contact';
import Alert from '@organisms/alert';

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
