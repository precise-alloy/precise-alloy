import { AvatarModel } from '@_types/organisms';
import Picture from '@atoms/pictures/Picture';
import RequireCss from '@helpers/RequireCss';

const Avatar = (model: AvatarModel) => {
  const { image, name, jobTitle } = model;

  return (
    <>
      <div className="zzz-o-avatar">
        <div className="zzz-o-avatar__image">
          <Picture {...image} alt={name} />
        </div>

        <div className="zzz-o-avatar__info">
          <h4 className="zzz-o-avatar__name">{name}</h4>

          <div className="zzz-o-avatar__job-title">{jobTitle}</div>
        </div>
        <RequireCss path="b-avatar" />
      </div>
    </>
  );
};

export default Avatar;
