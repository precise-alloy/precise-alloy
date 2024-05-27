import { createRef, MouseEvent, useState } from 'react';
import { useRootContext } from './root-context';
import { viteAbsoluteUrl } from '@helpers/functions';
import { useOnClickOutside } from './useClickOutside';

const ActiveItemOptions = () => {
  const { activeItem, isTopPanel } = useRootContext();
  const key = 'pl-show-state-selector';
  const keyExist = localStorage.getItem(key);
  const optionItemsRef = createRef<HTMLDivElement>();
  const buttonRef = createRef<HTMLButtonElement>();

  console.log(activeItem);

  useOnClickOutside(optionItemsRef, () => setShow(false), [buttonRef]);

  const handleStateToggle = (event: MouseEvent<HTMLAnchorElement>) => {
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

  const StateAnimationHtml = () =>
    keyExist ? (
      <></>
    ) : (
      <div className="pl-state-toggle__circles">
        <div className="pl-state-toggle__circle"></div>
        <div className="pl-state-toggle__circle"></div>
        <div className="pl-state-toggle__circle"></div>
        <div className="pl-state-toggle__circle"></div>
        <div className="pl-state-toggle__circle"></div>
        <div className="pl-state-toggle__circle"></div>
        <div className="pl-state-toggle__circle"></div>
        <div className="pl-state-toggle__circle"></div>
        <div className="pl-state-toggle__circle"></div>
        <div className="pl-state-toggle__circle"></div>
      </div>
    );

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
      <button ref={buttonRef} className={`xpack-o-root__control-button xpack-o-root__button-${show ? 'close' : 'setting'}`} onClick={handleClick}>
        <svg viewBox="0 0 30 30" className="xpack-o-root__control-svg">
          <use xlinkHref={show ? `/assets/images/root.svg#close` : '/assets/images/root.svg#setting'}></use>
        </svg>
      </button>

      <div ref={optionItemsRef} className={`xpack-o-root__active-item-options ${show ? 'show' : ''}`}>
        <a className="xpack-o-root__nav-item pl-state-toggle" href="#" onClick={handleStateToggle}>
          <StateAnimationHtml />
          {toggleCtaText}
        </a>

        <a className="xpack-o-root__nav-item pl-state-toggle" href="#" onClick={handleThemeToggle}>
          Change theme
        </a>

        <a className="xpack-o-root__nav-item panel-position" href="#" onClick={handleChangePanelPosition}>
          {isTopPanel ? 'Set left panel' : 'Set top panel'}
        </a>

        <a className="xpack-o-root__nav-item" href={viteAbsoluteUrl(activeItem.path, true)} target="_blank">
          Open in new tab
        </a>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ActiveItemOptions;
