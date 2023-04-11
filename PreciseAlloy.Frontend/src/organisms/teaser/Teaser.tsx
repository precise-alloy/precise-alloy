import { TeaserModel } from '@_types/types';
import Button from '@atoms/buttons/Button';
import Picture from '@atoms/pictures/Picture';
import RequireCss from '@helpers/RequireCss';
import { getModifiers } from '@helpers/functions';

const Teaser = (model: TeaserModel) => {
  const styleModifiers = getModifiers(model, 'zzz-o-teaser');
  const { button, title, description, image } = model;

  return (
    <section className={styleModifiers}>
      <div className="zzz-container">
        <div className="zzz-o-teaser__inner">
          <div className="zzz-o-teaser__content">
            {title && <h2 className="zzz-o-teaser__title h1">{title}</h2>}

            {description && <div className="zzz-o-teaser__description">{description}</div>}

            {button && (
              <div className="zzz-o-teaser__button">
                <Button {...button} />
              </div>
            )}
          </div>

          {image && <Picture {...image} />}
        </div>
      </div>

      <RequireCss path="b-teaser" />
    </section>
  );
};

export default Teaser;
