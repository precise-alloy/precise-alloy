import { ListModel } from '@_types/types';
import { getModifiers } from '@helpers/functions';
import Item from './Item';

const List = (model: ListModel) => {
  const styleModifiers = getModifiers(model, 'zzz-m-list');
  const { items } = model;

  return (
    <ul className={styleModifiers}>
      {items?.map((item, index) => {
        return <li key={index}>{<Item {...item} />}</li>;
      })}
    </ul>
  );
};

export default List;
