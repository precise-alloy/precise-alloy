import { TeaserModel } from '@_types/types';
import Button from '@atoms/buttons';
import Picture from '@atoms/pictures';
import RequireCss from '@helpers/RequireCss';
import { getModifiers } from '@helpers/functions';
import SectionHeader from '@molecules/section-header';

const Teaser = (model: TeaserModel) => {
  const styleModifiers = getModifiers(model, 'zzz-o-teaser');
  const { button, header, description, image } = model;

  return (
    <section className={styleModifiers}>
      <div className="zzz-container">
        <div className="zzz-o-teaser__inner">
          <div className="zzz-o-teaser__content">
            {header && <SectionHeader {...header} />}

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
