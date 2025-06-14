import { SinglePageNode } from '@_types/_root';
import { useRootContext } from './root-context';
import { MouseEvent } from 'react';
import { viteAbsoluteUrl } from '@helpers/functions';

export default function RenderedItem(item: SinglePageNode) {
  const { activeItem, setActiveItem } = useRootContext();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.hash = item.path;
    setActiveItem(item);

    return false;
  };

  const activeClass = activeItem && activeItem.path === item.path ? ' xpack-o-root__nav-item--active' : '';

  return (
    <a className={'xpack-o-root__nav-item' + activeClass} href={viteAbsoluteUrl(item.path, true)} target="inner" onClick={handleClick}>
      {item.name}
    </a>
  );
}
