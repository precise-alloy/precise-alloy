import { ListWithIconModel } from '@_types/types';
import { getModifiers } from '@helpers/functions';
import ItemWithIcon from './ItemWithIcon';

const List = (model: ListWithIconModel) => {
  const styleModifiers = getModifiers(model, 'zzz-m-list-with-icon');
  const { items } = model;

  return (
    <ul className={styleModifiers}>
      {items?.map((item, index) => {
        return <li key={index}>{<ItemWithIcon {...item} />}</li>;
      })}
    </ul>
  );
};

export default List;
