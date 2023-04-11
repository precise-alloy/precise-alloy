import Icon from '@atoms/icons/Icon';
import { getModifiers } from '@helpers/functions';
import { LinkWithIconModel } from '@_types/types';
import { spawn } from 'child_process';

const LinkWithIcon = (model: LinkWithIconModel) => {
  const styleModifiers = getModifiers(model, 'zzz-a-link-with-icon');
  const { url, icon, target, text } = model;

  return (
    <a className={styleModifiers} href={url} target={target}>
      {icon && <Icon {...icon} />} {text && <span>{text}</span>}
    </a>
  );
};

export { LinkWithIcon };
export default LinkWithIcon;
