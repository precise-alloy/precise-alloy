import { RootItemModel, RootModel } from '@_types/types';
import { useEffect, useState } from 'react';
import { RootContext, RootData } from './root-context';
import FrameControls from './FrameControls';
import ActiveItemOptions from './ActiveItemOptions';
import RootNav from './RootNav';
import { viteAbsoluteUrl } from '@helpers/functions';

export default function Root({ routes }: RootModel) {
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
  }, [routes]);

  const handleStorageChange = (event: StorageEvent) => {
    switch (event.key) {
      case 'MSG_IS_TOP_PANEL':
        setTopPanel(event.newValue === 'true');
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
    </RootContext.Provider>
  ) : (
    <></>
  );
}
