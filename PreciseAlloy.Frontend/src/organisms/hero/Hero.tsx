import { HeroModel } from '@_types/organisms';
import Button from '@atoms/buttons/Button';
import Picture from '@atoms/pictures/Picture';
import RequireCss from '@helpers/RequireCss';
import { getModifiers } from '@helpers/functions';

const Hero = (model: HeroModel) => {
  const styleModifiers = getModifiers(model, 'zzz-o-hero');
  const { button, label, title, description, image } = model;

  return (
    <section className={styleModifiers}>
      <div className="zzz-container">
        <div className="zzz-o-hero__inner">
          <div className="zzz-o-hero__content">
            {label && <div className="zzz-o-hero__label">{label}</div>}

            {title && <h1 className="zzz-o-hero__title">{title}</h1>}

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
