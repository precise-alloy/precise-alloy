import { ItemModel } from '@_types/molecules';
import Icon from '@atoms/icons/Icon';
import { getModifiers } from '@helpers/functions';

const Item = (model: ItemModel) => {
  const styleModifiers = getModifiers(model, 'zzz-m-item');
  const { text, icon } = model;

  return (
    <div className={styleModifiers}>
      {icon && <Icon {...icon} />} {text && <div className="zzz-m-item__content">{text}</div>}
    </div>
  );
};

export default Item;
