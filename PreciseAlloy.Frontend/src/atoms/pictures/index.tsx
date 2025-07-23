import { getModifiers } from '@helpers/functions';
import { PictureModel } from '@_types/types';

const Picture = (model: PictureModel) => {
  const { sources, src, alt, width, height, lazy = true } = model;

  return (
    <picture className={getModifiers(model, 'zzz-a-picture')}>
      {sources?.map((s, index) => (
        <source key={index} media={s.media} srcSet={s.srcSet} />
      ))}
      <img alt={alt} height={height} loading={lazy ? 'lazy' : undefined} src={src} width={width} />
    </picture>
  );
};

export { Picture };
export default Picture;
