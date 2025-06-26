import { MultiplePageNode, RootItemModel } from '@_types/types';
import { debounce } from 'lodash';
import { useRef, useCallback, useEffect, useState } from 'react';
import { useRootContext } from './root-context';
import { viteAbsoluteUrl } from '@helpers/functions';
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(
    debounce((text: string) => {
      const tempRoutes: RootItemModel[] = [],
        tempRoutesSearch: RootItemModel[] = [];
      const isItemIncludedText: (item: RootItemModel) => boolean = (item: RootItemModel) => {
        if (item.type === 'single') {
          return text.trim()
            ? text
                .trim()
                .toLocaleLowerCase()
                .split(/\s+/)
                .some((s) => item.name.toLocaleLowerCase().includes(s))
            : false;
        }

        return text.trim()
          ? text
              .trim()
              .toLocaleLowerCase()
              .split(/\s+/)
              .some((s) => item.name.toLocaleLowerCase().includes(s) || (item as MultiplePageNode).items.some((x) => isItemIncludedText(x)))
          : false;
      };

      routesProp.forEach((item) => {
        if (isItemIncludedText(item)) {
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
  }, [handleChange, textSearch]);

  return (
    <>
      {/*eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions*/}
      <a ref={buttonRef} className="xpack-o-root__button-close" onClick={handleClick}>
        <button className="xpack-o-root__control-button xpack-o-root__button-close" aria-label={show ? 'Close' : 'Pages'}>
          <svg className="xpack-o-root__control-svg">
            <use xlinkHref={viteAbsoluteUrl('/assets/images/root.svg#' + (show ? 'close' : 'list'))}></use>
          </svg>
        </button>
      </a>

      <p className="xpack-o-root__title">{activeItem?.name}</p>

      <div ref={navItemRef} className={`xpack-o-root__nav-items ${show ? 'show' : ''}`}>
        <div className="xpack-o-root__search">
          <input
            type={'text'}
            ref={inputRef}
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
                    .filter((r) => r.path != '/' && r.path != '/index')
                    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                    .map((item, index) =>
                      item.path ? (
                        <RenderedItem key={index} {...item} />
                      ) : (
                        <details
                          className="xpack-o-root__nav-item-collection"
                          key={index}
                          open={
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            !!(item as MultiplePageNode).items.find((x: any) => {
                              return window.location.hash.includes(x.path);
                            })
                          }
                        >
                          <summary>{item.name}</summary>
                          {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
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
                    className="xpack-o-root__nav-item-collection"
                    key={index}
                    open={
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      !!(item as MultiplePageNode).items.find((x: any) => {
                        return window.location.hash.includes(x.path);
                      })
                    }
                  >
                    <summary>{item.name}</summary>
                    {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
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
