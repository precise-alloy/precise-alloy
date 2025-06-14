import { AvatarModel } from '@_types/organisms';
import Picture from '@atoms/pictures';
import RequireCss from '@helpers/RequireCss';

const Avatar = (model: AvatarModel) => {
  const { image, name, jobTitle } = model;

  return (
    <div className="zzz-o-avatar">
      <div className="zzz-o-avatar__image">
        <Picture {...image} />
      </div>

      <div className="zzz-o-avatar__info">
        <h3 className="zzz-o-avatar__name h4">{name}</h3>

        <div className="zzz-o-avatar__job-title">{jobTitle}</div>
      </div>
      <RequireCss path="b-avatar" />
    </div>
  );
};

export default Avatar;
