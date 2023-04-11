import { ItemWithIconModel } from '@_types/molecules';
import Icon from '@atoms/icons/Icon';
import { getModifiers } from '@helpers/functions';

const ItemWithIcon = (model: ItemWithIconModel) => {
  const styleModifiers = getModifiers(model, 'zzz-m-item-with-icon');
  const { text, icon } = model;

  return (
    <div className={styleModifiers}>
      {icon && <Icon {...icon} />} {text && <span>{text}</span>}
    </div>
  );
};

export default ItemWithIcon;
