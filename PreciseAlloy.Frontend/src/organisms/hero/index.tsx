import { HeroModel } from '@_types/organisms';
import Button from '@atoms/buttons';
import Picture from '@atoms/pictures';
import RequireCss from '@helpers/RequireCss';
import { getModifiers } from '@helpers/functions';
import SectionHeader from '@molecules/section-header';

const Hero = (model: HeroModel) => {
  const styleModifiers = getModifiers(model, 'zzz-o-hero');
  const { button, label, header, description, image } = model;

  return (
    <section className={styleModifiers}>
      <div className="zzz-container">
        <div className="zzz-o-hero__inner">
          <div className="zzz-o-hero__content">
            {label && <div className="zzz-o-hero__label">{label}</div>}

            {header && <SectionHeader {...header} />}

            {description && <div className="zzz-o-hero__description">{description}</div>}

            {button && (
              <div className="zzz-o-hero__button">
                <Button {...button} />
              </div>
            )}
          </div>

          {image && (
            <div className="zzz-o-hero__image">
              <Picture {...image} />
            </div>
          )}
        </div>
      </div>

      <RequireCss path={'b-hero'} />
    </section>
  );
};

export default Hero;
