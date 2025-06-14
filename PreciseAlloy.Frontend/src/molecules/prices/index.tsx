import { PriceModel } from '@_types/types';
import Button from '@atoms/buttons';
import { getModifiers } from '@helpers/functions';
import List from '@molecules/list';

const Price = (model: PriceModel) => {
  const styleModifiers = getModifiers(model, 'zzz-m-price');
  const { tag, price, info, button, list } = model;

  return (
    <div className={styleModifiers}>
      {tag && <div className="zzz-m-price__tag">{tag}</div>}

      {price && (
        <div className="zzz-m-price__price">
          {price.value && <span className="value">{price.value}</span>}
          {price.time && <span className="time">/{price.time}</span>}
        </div>
      )}

      {info && <div className="zzz-m-price__info">{info}</div>}

      {list && <List {...list} />}

      {button && (
        <div className="zzz-m-price__button">
          <Button {...button} />
        </div>
      )}
    </div>
  );
};

export default Price;
