import { RootItemModel } from '@_types/types';
import { debounce } from 'lodash';
import { createRef, MouseEvent, RefObject, useCallback, useEffect, useState } from 'react';
import { useOnClickOutside } from './Root';
import { useRootContext } from './root-context';

interface Props {
  routes: RootItemModel[];
}

const RenderedItem = (item: RootItemModel) => {
  const { activeItem, setActiveItem } = useRootContext();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.hash = item.path;
    setActiveItem(item);

    return false;
  };

  const activeClass = activeItem && activeItem.path === item.path ? ' xpack-o-root__nav-item--active' : '';

  return (
    <a className={'xpack-o-root__nav-item' + activeClass} href={item.path} target="inner" onClick={handleClick}>
      {item.name}
    </a>
  );
};

const RootNav = ({ routes: routesProp }: Props) => {
  const { activeItem, setActiveItem } = useRootContext();
  const [show, setShow] = useState(false);
  const navItemRef = createRef<HTMLDivElement>();
  const buttonRef = createRef<HTMLAnchorElement>();
  const [routes, setRoutes] = useState(routesProp);
  const [routesSearch, setRoutesSearch] = useState<RootItemModel[]>([]);
  const [textSearch, setTextSearch] = useState('');

  useOnClickOutside(navItemRef, () => setShow(false), [buttonRef]);

  const handleClick = () => {
    setShow(!show);
  };

  const handleChange = useCallback(
    debounce((text: string) => {
      let tempRoutes: RootItemModel[] = [],
        tempRoutesSearch: RootItemModel[] = [];

      routesProp.forEach((item) => {
        if (
          text.trim() &&
          text
            .trim()
            .toLocaleLowerCase()
            .split(/\s+/)
            .some((s) => item.name.toLocaleLowerCase().includes(s))
        ) {
          tempRoutesSearch.push(item);
        } else {
          tempRoutes.push(item);
        }
      });

      setRoutesSearch(tempRoutesSearch);
      setRoutes(tempRoutes);
    }, 500),
    []
  );

  useEffect(() => {
    handleChange(textSearch);
  }, [textSearch]);

  return (
    <>
      <a ref={buttonRef} className="xpack-o-root__button-close" onClick={handleClick}>
        <button className="xpack-o-root__control-button xpack-o-root__button-close">
          <svg className="xpack-o-root__control-svg">
            <use xlinkHref={`${show ? '/assets/images/root.svg#close' : '/assets/images/root.svg#list'}`}></use>
          </svg>
        </button>
      </a>

      <p className="xpack-o-root__title">{activeItem?.name}</p>

      <div ref={navItemRef} className={`xpack-o-root__nav-items ${show ? 'show' : ''}`}>
        <div className="xpack-o-root__search">
          <input
            type={'text'}
            value={textSearch}
            placeholder="Find a pattern"
            onChange={(e) => {
              setTextSearch(e.target.value);
            }}
          ></input>
        </div>

        <div className="xpack-o-root__items">
          {textSearch.trim() && (
            <div className="xpack-o-root__search-matches">
              {routesSearch.length
                ? routesSearch
                    .filter((r) => r.path != '/')
                    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                    .map((item, index) => <RenderedItem key={index} {...item} />)
                : textSearch.trim() && <div className="xpack-o-root__nav-message ">No pattern matches</div>}
            </div>
          )}

          <div className={`xpack-o-root__search-not-matches ${textSearch.trim() ? 'blur' : ''}`}>
            {routes
              .filter((r) => r.path != '/')
              .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
              .map((item, index) => (
                <RenderedItem key={index} {...item} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RootNav;
