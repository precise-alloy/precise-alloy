import { MultiplePageNode, RootItemModel } from '@_types/types';
import { debounce } from 'lodash';
import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { viteAbsoluteUrl } from '@helpers/functions';

import { useRootContext } from './root-context';
import { useOnClickOutside } from './use-click-outside';
import RenderedItem from './rendered-item';

interface Props {
  routes: RootItemModel[];
}

export default function RootNav({ routes: routesProp }: Props) {
  const { activeItem } = useRootContext();
  const [show, setShow] = useState(false);
  const navItemRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [routes, setRoutes] = useState(routesProp);
  const [routesSearch, setRoutesSearch] = useState<RootItemModel[]>([]);
  const [textSearch, setTextSearch] = useState('');

  const closeMenu = () => {
    setShow(false);
    setTextSearch('');
  };

  useOnClickOutside(navItemRef, closeMenu, [buttonRef]);

  const handleClick = () => {
    if (!show && inputRef.current) {
      inputRef.current.focus();
    }
    setShow(!show);
  };

  const handleChange = useCallback(
    (text: string) => {
      const searchTerms = text.trim().toLocaleLowerCase().split(/\s+/);
      const isSearchActive = searchTerms.length > 0 && text.trim();

      const isItemIncludedText: (item: RootItemModel) => boolean = (item: RootItemModel) => {
        if (!isSearchActive) return false;

        if (item.type === 'single') {
          return searchTerms.some((s) => item.name.toLocaleLowerCase().includes(s));
        }

        return searchTerms.some(
          (s) => item.name.toLocaleLowerCase().includes(s) || (item as MultiplePageNode).items.some((x) => isItemIncludedText(x))
        );
      };

      const tempRoutesSearch: RootItemModel[] = [];
      const tempRoutes: RootItemModel[] = [];

      routesProp.forEach((item) => {
        (isItemIncludedText(item) ? tempRoutesSearch : tempRoutes).push(item);
      });

      setRoutesSearch(tempRoutesSearch);
      setRoutes(tempRoutes);
    },
    [routesProp]
  );

  const debouncedHandleChange = useMemo(() => debounce(handleChange, 500), [handleChange]);

  useEffect(() => {
    debouncedHandleChange(textSearch);
  }, [debouncedHandleChange, textSearch]);

  return (
    <>
      {/*eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions*/}
      <a ref={buttonRef} className="xpack-o-root__button-close" onClick={handleClick}>
        <button aria-label={show ? 'Close' : 'Pages'} className="xpack-o-root__control-button xpack-o-root__button-close">
          <svg className="xpack-o-root__control-svg">
            <use xlinkHref={viteAbsoluteUrl('/assets/images/root.svg#' + (show ? 'close' : 'list'))} />
          </svg>
        </button>
      </a>

      <p className="xpack-o-root__title">{activeItem?.name}</p>

      <div ref={navItemRef} className={`xpack-o-root__nav-items ${show ? 'show' : ''}`}>
        <div className="xpack-o-root__search">
          <input
            ref={inputRef}
            placeholder="Find a pattern"
            type={'text'}
            value={textSearch}
            onChange={(e) => {
              setTextSearch(e.target.value);
            }}
          />
        </div>

        <div className="xpack-o-root__items">
          {textSearch.trim() && (
            <div className="xpack-o-root__search-matches">
              {routesSearch.length
                ? routesSearch
                    .filter((r) => r.path != '/' && r.path != '/index')
                    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                    .map((item, index) =>
                      item.path ? (
                        <RenderedItem key={index} {...item} />
                      ) : (
                        <details
                          key={index}
                          className="xpack-o-root__nav-item-collection"
                          open={
                            !!(item as MultiplePageNode).items.find((x: any) => {
                              return window.location.hash.includes(x.path);
                            })
                          }
                        >
                          <summary>{item.name}</summary>
                          {}
                          {(item as MultiplePageNode).items.map((node: any, idx: number) => (
                            <RenderedItem key={idx} {...node} />
                          ))}
                        </details>
                      )
                    )
                : textSearch.trim() && <div className="xpack-o-root__nav-message ">No pattern matches</div>}
            </div>
          )}

          <div className={`xpack-o-root__search-not-matches ${textSearch.trim() ? 'blur' : ''}`}>
            {routes
              .filter((r) => r.path != '/' && r.path != '/index')
              .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
              .map((item, index) =>
                item.path ? (
                  <RenderedItem key={index} {...item} />
                ) : (
                  <details
                    key={index}
                    className="xpack-o-root__nav-item-collection"
                    open={
                      !!(item as MultiplePageNode).items.find((x: any) => {
                        return window.location.hash.includes(x.path);
                      })
                    }
                  >
                    <summary>{item.name}</summary>
                    {}
                    {(item as MultiplePageNode).items.map((node: any, idx: number) => (
                      <RenderedItem key={idx} {...node} />
                    ))}
                  </details>
                )
              )}
          </div>
        </div>
      </div>
    </>
  );
}
