import { AvatarModel } from '@_types/organisms';
import Picture from '@atoms/pictures/Picture';
import RequireCss from '@helpers/RequireCss';

const Avatar = (model: AvatarModel) => {
  const { image, name, jobTitle } = model;

  return (
    <div className="zzz-o-avatar">
      <div className="zzz-o-avatar__image">
        <Picture {...image} />
        <h3>{name}</h3>
        <div>{jobTitle}</div>
      </div>
      <RequireCss path="b-avatar" />
    </div>
  );
};

export default Avatar;
