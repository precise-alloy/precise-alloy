import Icon from '@atoms/icons/Icon';
import { getModifiers } from '@helpers/functions';
import { LinkWithIconModel } from '@_types/types';

const LinkWithIcon = (model: LinkWithIconModel) => {
  const styleModifiers = getModifiers(model, 'zzz-a-link-with-icon');
  const { url, icon, target } = model;

  return (
    <a className={styleModifiers} href={url} target={target}>
      {icon && <Icon {...icon} />}
    </a>
  );
};

export { LinkWithIcon };
export default LinkWithIcon;
