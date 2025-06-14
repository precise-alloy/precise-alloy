import Icon from '@atoms/icons';
import { getModifiers } from '@helpers/functions';
import { LinkWithIconModel } from '@_types/types';

const LinkWithIcon = (model: LinkWithIconModel) => {
  const styleModifiers = getModifiers(model, 'zzz-a-link-with-icon');
  const { url, icon, target, text, ariaLabel } = model;

  return (
    <a className={styleModifiers} href={url} target={target} aria-label={ariaLabel}>
      {icon && <Icon {...icon} />} {text && <span>{text}</span>}
    </a>
  );
};

export { LinkWithIcon };
export default LinkWithIcon;
