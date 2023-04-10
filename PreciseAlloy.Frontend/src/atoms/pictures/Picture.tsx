import { getModifiers } from '@helpers/functions';
import { PictureModel } from '@_types/types';

const Picture = (model: PictureModel) => {
  const { sources, src, alt, lazy = true } = model;

  return (
    <picture className={getModifiers(model, 'zzz-a-picture')}>
      {sources?.map((s, index) => (
        <source key={index} media={s.media} srcSet={s.srcSet} />
      ))}
      <img src={src} alt={alt} loading={lazy ? 'lazy' : undefined} />
    </picture>
  );
};

export { Picture };
export default Picture;
