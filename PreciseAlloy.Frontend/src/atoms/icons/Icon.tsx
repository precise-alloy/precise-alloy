import { getModifiers } from '@helpers/functions';
import { IconModel } from '@_types/types';

const Icon = (model: IconModel) => {
  const { height, iconPath, viewBoxHeight, viewBoxWidth, width } = model;
  const styleModifiers = getModifiers(model, 'zzz-a-icon');
  const href = iconPath.startsWith('#') ? '/assets/images/icons.svg' + iconPath : iconPath;

  return (
    <svg
      className={styleModifiers}
      aria-hidden="true"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={width || viewBoxWidth}
      height={height || viewBoxHeight}
    >
      <use xlinkHref={href}></use>
    </svg>
  );
};

export { Icon };
export default Icon;
