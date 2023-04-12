import { PricesModel } from '@_types/organisms';
import RequireCss from '@helpers/RequireCss';
import { getModifiers } from '@helpers/functions';
import Price from '@molecules/prices/Price';
import SectionHeader from '@molecules/section-header/SectionHeader';

const Prices = (model: PricesModel) => {
  const styleModifiers = getModifiers(model, 'zzz-o-prices');
  const { label, header, description, items } = model;

  return (
    <div className={styleModifiers}>
      <div className="zzz-container">
        <div className="zzz-o-prices__inner">
          {label && <div className="zzz-o-prices__label">{label}</div>}

          {header && <SectionHeader {...header} />}

          {description && <div className="zzz-o-prices__description">{description}</div>}

          {items && (
            <div className="zzz-o-prices__items">
              {items.map((item, index) => {
                return <Price key={index} {...item} />;
              })}
            </div>
          )}
        </div>
      </div>

      <RequireCss path={'b-prices'} />
    </div>
  );
};

export default Prices;
