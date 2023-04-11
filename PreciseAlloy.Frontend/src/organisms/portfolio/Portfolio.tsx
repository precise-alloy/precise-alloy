import { PortfolioModel } from '@_types/types';
import Button from '@atoms/buttons/Button';
import Picture from '@atoms/pictures/Picture';
import RequireCss from '@helpers/RequireCss';
import { getModifiers } from '@helpers/functions';
import SectionHeader from '@molecules/section-header/SectionHeader';

const Portfolio = (model: PortfolioModel) => {
  const styleModifiers = getModifiers(model, 'zzz-o-portfolio');
  const { label, header, description, images, button } = model;

  return (
    <div className={styleModifiers}>
      <div className="zzz-container">
        <div className="zzz-o-portfolio__inner">
          {label && <div className="zzz-o-portfolio__label">{label}</div>}

          {header && <SectionHeader {...header} />}

          {description && <div className="zzz-o-portfolio__description">{description}</div>}

          {images && (
            <div className="zzz-o-portfolio__images">
              {images.map((image, index) => {
                return <Picture key={index} {...image} />;
              })}
            </div>
          )}

          {button && (
            <div className="zzz-o-portfolio__button">
              <Button {...button} />
            </div>
          )}
        </div>
      </div>

      <RequireCss path={'b-portfolio'} />
    </div>
  );
};

export default Portfolio;
