import { RootItemModel, RootModel } from '@_types/types';
import { RefObject, useEffect, useState } from 'react';
import { RootContext, RootData } from './root-context';
import FrameControls from './FrameControls';
import ActiveItemOptions from './ActiveItemOptions';
import RootNav from './RootNav';
import RequireCss from '@helpers/RequireCss';
import { viteAbsoluteUrl } from '@helpers/functions';

export function useOnClickOutside(ref: RefObject<HTMLElement>, handler: any, otherDependenceRef?: RefObject<HTMLElement>[]) {
  useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      if (otherDependenceRef && otherDependenceRef.some((r) => r.current?.contains(event.target))) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

const Root = ({ routes }: RootModel) => {
  const [activeItem, setActiveItem] = useState<RootItemModel>();
  const [isTopPanel, setTopPanel] = useState<boolean>(localStorage.getItem('MSG_IS_TOP_PANEL') === 'true');

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    const frame = document.querySelector<HTMLIFrameElement>('#root-iframe');
    if (!frame) {
      return;
    }

    frame.src = viteAbsoluteUrl(activeItem.path, true);
    document.title = activeItem.name + ' - ' + import.meta.env.VITE_TITLE_SUFFIX;
  }, [activeItem]);

  const rootData: RootData = {
    activeItem,
    setActiveItem,
    isTopPanel,
    setTopPanel,
  };

  useEffect(() => {
    const hash = window.location.hash;
    const activePath = hash && hash.startsWith('#/') ? hash.substring(1) : '/pages/home';
    const activeIndex = routes.findIndex((r) => r.path === activePath);
    if (activeIndex >= 0) {
      setActiveItem(routes[activeIndex]);
    } else {
      const homeIndex = routes.findIndex((r) => r.path === '/pages/home');
      setActiveItem(routes[homeIndex]);
    }
  }, []);

  const handleStorageChange = (event: StorageEvent) => {
    switch (event.key) {
      case 'MSG_IS_TOP_PANEL':
        const isTopPanel = event.newValue === 'true';
        setTopPanel(isTopPanel);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return routes ? (
    <RootContext.Provider value={rootData}>
      <div className={`xpack-o-root ${isTopPanel ? 'top-panel' : ''}`}>
        <RootNav routes={routes} />
        <FrameControls />
        <ActiveItemOptions />
      </div>
      <RequireCss path="b-root" />
    </RootContext.Provider>
  ) : (
    <></>
  );
};

export default Root;
