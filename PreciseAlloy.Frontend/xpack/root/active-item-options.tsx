import { createRef, MouseEvent, useState } from 'react';
import { viteAbsoluteUrl } from '@helpers/functions';

import { useRootContext } from './root-context';
import { useOnClickOutside } from './use-click-outside';
import StateAnimationHtml from './state-animation-html';

export default function ActiveItemOptions() {
  const { activeItem, isTopPanel } = useRootContext();
  const key = 'pl-show-state-selector';
  const keyExist = localStorage.getItem(key);
  const optionItemsRef = createRef<HTMLDivElement>();
  const buttonRef = createRef<HTMLButtonElement>();

  useOnClickOutside(optionItemsRef, () => setShow(false), [buttonRef]);

  const handleStateToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (keyExist) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, 'true');
    }

    location.reload();

    return false;
  };

  const handleThemeToggle = () => {
    window.dispatchEvent(new CustomEvent('toggleTheme'));
  };

  const toggleCtaText = keyExist ? 'Hide state selector' : 'Show state selector';

  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  const handleChangePanelPosition = () => {
    const key = 'MSG_IS_TOP_PANEL';
    const value = isTopPanel ? 'false' : 'true';

    window.localStorage.setItem(key, value);
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: value }));

    setShow(false);
  };

  return activeItem ? (
    <div>
      <button
        ref={buttonRef}
        aria-label={show ? 'Close' : 'Settings'}
        className={`xpack-o-root__control-button xpack-o-root__button-${show ? 'close' : 'setting'}`}
        onClick={handleClick}
      >
        <svg className="xpack-o-root__control-svg" viewBox="0 0 30 30">
          <use xlinkHref={show ? `/assets/images/root.svg#close` : '/assets/images/root.svg#setting'} />
        </svg>
      </button>

      <div ref={optionItemsRef} className={`xpack-o-root__active-item-options ${show ? 'show' : ''}`}>
        <button className="xpack-o-root__nav-item pl-state-toggle" onClick={handleStateToggle}>
          <StateAnimationHtml keyExist={!!keyExist} />
          {toggleCtaText}
        </button>

        <button className="xpack-o-root__nav-item pl-state-toggle" onClick={handleThemeToggle}>
          Change theme
        </button>

        <button className="xpack-o-root__nav-item panel-position" onClick={handleChangePanelPosition}>
          {isTopPanel ? 'Set left panel' : 'Set top panel'}
        </button>

        <a className="xpack-o-root__nav-item" href={viteAbsoluteUrl(activeItem.path, true)} rel="noreferrer" target="_blank">
          Open in new tab
        </a>

        <div className="xpack-o-root__nav-item-seperator" />

        <a className="xpack-o-root__nav-item" href="https://tuyen.blog/optimizely-cms/frontend/get-started/" rel="noreferrer" target="_blank">
          About this library
          <svg className="xpack-o-root__control-svg" viewBox="0 0 30 30">
            <use xlinkHref="/assets/images/root.svg#external" />
          </svg>
        </a>
      </div>
    </div>
  ) : (
    <></>
  );
}
