import { useState } from 'react';

const MIN_FRAME_SIZE = 350;
const MSG_IFRAME_SIZE = 'MSG_IFRAME_SIZE';

const randomIntFromInterval = (min: number, max: number): number => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default function FrameControls() {
  const [discoTimer, setDiscoTimer] = useState<NodeJS.Timeout>();

  const setIFrameWidth = (width?: number) => {
    const wrapper = document.getElementById('root-iframe-wrapper');

    if (!wrapper) {
      return;
    }

    if (width) {
      wrapper.style.maxWidth = `min(100%, ${width}px)`;
      sessionStorage.setItem(MSG_IFRAME_SIZE, width + '');
    } else {
      wrapper.style.removeProperty('max-width');
    }
  };

  const handleMobileClick = () => {
    if (discoTimer) {
      clearInterval(discoTimer);
    }

    const width = randomIntFromInterval(MIN_FRAME_SIZE, 768);

    setIFrameWidth(width);
  };

  const handleTabletClick = () => {
    if (discoTimer) {
      clearInterval(discoTimer);
    }

    const width = randomIntFromInterval(768, 1024);

    setIFrameWidth(width);
  };

  const handleDesktopClick = () => {
    if (discoTimer) {
      clearInterval(discoTimer);
    }

    const maxWidth = document.body.clientWidth - 300;

    const width = randomIntFromInterval(1024, Math.max(1024, maxWidth));

    setIFrameWidth(width);
  };

  const handleFullClick = () => {
    if (discoTimer) {
      clearInterval(discoTimer);
    }

    setIFrameWidth(undefined);
    sessionStorage.removeItem(MSG_IFRAME_SIZE);
  };

  const handleRandomClick = () => {
    if (discoTimer) {
      clearInterval(discoTimer);
    }

    const maxWidth = document.body.clientWidth - 300;

    const width = randomIntFromInterval(MIN_FRAME_SIZE, Math.max(MIN_FRAME_SIZE, maxWidth));

    setIFrameWidth(width);
    sessionStorage.setItem(MSG_IFRAME_SIZE, width + '');
  };

  const handleDiscoClick = () => {
    if (discoTimer) {
      clearInterval(discoTimer);

      return;
    }

    const timer = setInterval(() => {
      const maxWidth = document.body.clientWidth - 300;

      const width = randomIntFromInterval(MIN_FRAME_SIZE, Math.max(MIN_FRAME_SIZE, maxWidth));

      setIFrameWidth(width);
      sessionStorage.setItem(MSG_IFRAME_SIZE, width + '');
    }, 2000);

    setDiscoTimer(timer);
  };

  return (
    <div className="xpack-o-root__frame-control">
      <div className="xpack-o-root__actual-width" id="root-actual-iframe-width" />
      <div className="xpack-o-root__controls">
        <button aria-label="Mobile View" className="xpack-o-root__control-button" title="Mobile View" onClick={handleMobileClick}>
          <svg className="xpack-o-root__control-svg" viewBox="0 0 24 24">
            <use xlinkHref="/assets/images/root.svg#phone" />
          </svg>
        </button>
        <button aria-label="Tablet View" className="xpack-o-root__control-button" title="Tablet View" onClick={handleTabletClick}>
          <svg className="xpack-o-root__control-svg" viewBox="0 0 24 24">
            <use xlinkHref="/assets/images/root.svg#tablet" />
          </svg>
        </button>
        <button aria-label="Desktop View" className="xpack-o-root__control-button" title="Desktop View" onClick={handleDesktopClick}>
          <svg className="xpack-o-root__control-svg" viewBox="0 0 24 24">
            <use xlinkHref="/assets/images/root.svg#desktop" />
          </svg>
        </button>
        <button aria-label="Full Width View" className="xpack-o-root__control-button" title="Full Width View" onClick={handleFullClick}>
          <svg className="xpack-o-root__control-svg" viewBox="0 0 24 24">
            <use xlinkHref="/assets/images/root.svg#hay" />
          </svg>
        </button>
        <button aria-label="Random Width View" className="xpack-o-root__control-button" title="Random Width View" onClick={handleRandomClick}>
          <svg className="xpack-o-root__control-svg" viewBox="0 0 24 24">
            <use xlinkHref="/assets/images/root.svg#random" />
          </svg>
        </button>
        <button aria-label="Disco Mode View" className="xpack-o-root__control-button" title="Disco Mode View" onClick={handleDiscoClick}>
          <svg className="xpack-o-root__control-svg" viewBox="0 0 24 24">
            <use xlinkHref="/assets/images/root.svg#disco-ball" />
          </svg>
        </button>
      </div>
    </div>
  );
}
