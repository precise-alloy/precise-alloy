import { AvatarModel } from '@_types/organisms';
import RequireCss from '@helpers/RequireCss';

const Avatar = (model: AvatarModel) => {
  const { src, name, jobTitle } = model;

  return (
    <div className="zzz-o-avatar">
      <div className="zzz-o-avatar__image">
        <img src={src} alt={name} />
        <h3>{name}</h3>
        <div>{jobTitle}</div>
      </div>
      <RequireCss path="b-avatar" />
    </div>
  );
};

export default Avatar;
