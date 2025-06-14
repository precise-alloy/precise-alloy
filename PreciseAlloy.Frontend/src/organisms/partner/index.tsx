import { PartnerModel } from '@_types/types';
import Button from '@atoms/buttons';
import Picture from '@atoms/pictures';
import RequireCss from '@helpers/RequireCss';
import { getModifiers } from '@helpers/functions';
import SectionHeader from '@molecules/section-header';

const Partner = (model: PartnerModel) => {
  const styleModifiers = getModifiers(model, 'zzz-o-partner');
  const { label, header, button, description, images } = model;

  return (
    <div className={styleModifiers}>
      <div className="zzz-container">
        <div className="zzz-o-partner__inner">
          <div className="zzz-o-partner__content">
            {label && <div className="zzz-o-partner__label">{label}</div>}

            {header && <SectionHeader {...header} />}

            {description && <div className="zzz-o-partner__description">{description}</div>}
          </div>

          {images && (
            <div className="zzz-o-partner__images">
              {images.map((image, index) => {
                return <Picture key={index} {...image} />;
              })}
            </div>
          )}

          {button && (
            <div className="zzz-o-partner__button">
              <Button {...button} />
            </div>
          )}
        </div>
      </div>

      <RequireCss path={'b-partner'} />
    </div>
  );
};

export default Partner;
