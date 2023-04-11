import { getModifiers } from '@helpers/functions';
import { LinkListWithIconModel } from '@_types/types';
import LinkWithIcon from '@atoms/links/LinkWithIcon';

const LinkListWithIcon = (model: LinkListWithIconModel) => {
  const styleModifiers = getModifiers(model, 'zzz-a-link-list-with-icon');
  const { items } = model;

  return (
    <ul className={styleModifiers}>
      {items.map((item, index) => {
        return (
          <li>
            <LinkWithIcon key={index} {...item} />
          </li>
        );
      })}
    </ul>
  );
};

export { LinkListWithIcon };
export default LinkListWithIcon;
