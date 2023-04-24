import Picture from '@atoms/pictures/Picture';
import { getModifiers } from '@helpers/functions';
import RequireCss from '@helpers/RequireCss';
import SectionHeader from '@molecules/section-header/SectionHeader';
import { EpiForm } from '@organisms/epi-form/EpiForm';
import { ContactModel } from '@_types/organisms';
import ContactForm from './ContactForm';

const Contact = (model: ContactModel) => {
  const modifiers = getModifiers(model, 'zzz-o-contact');
  const { header, description, form, map } = model;

  return (
    <>
      <div className={modifiers}>
        <div className="zzz-container">
          <div className="zzz-o-contact__info">
            {header && <SectionHeader heading={header.heading} headingLevel={header.headingLevel} />}

            {description && <div className="zzz-o-contact__description">{description}</div>}
          </div>

          <div className="zzz-o-contact__main">
            {form && (
              <div className="zzz-o-contact__contact-form">
                <EpiForm {...form}></EpiForm>
              </div>
            )}

            {map && (
              <div className={`zzz-o-contact__map`}>
                <Picture {...map}></Picture>
              </div>
            )}
          </div>
        </div>
      </div>

      <RequireCss path="b-contact" />
    </>
  );
};

export { Contact };
export default Contact;
