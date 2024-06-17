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
      <div id="root-actual-iframe-width" className="xpack-o-root__actual-width"></div>
      <div className="xpack-o-root__controls">
        <button className="xpack-o-root__control-button" onClick={handleMobileClick} aria-label="Mobile View" title="Mobile View">
          <svg viewBox="0 0 24 24" className="xpack-o-root__control-svg">
            <use xlinkHref="/assets/images/root.svg#phone"></use>
          </svg>
        </button>
        <button className="xpack-o-root__control-button" onClick={handleTabletClick} aria-label="Tablet View" title="Tablet View">
          <svg viewBox="0 0 24 24" className="xpack-o-root__control-svg">
            <use xlinkHref="/assets/images/root.svg#tablet"></use>
          </svg>
        </button>
        <button className="xpack-o-root__control-button" onClick={handleDesktopClick} aria-label="Desktop View" title="Desktop View">
          <svg viewBox="0 0 24 24" className="xpack-o-root__control-svg">
            <use xlinkHref="/assets/images/root.svg#desktop"></use>
          </svg>
        </button>
        <button className="xpack-o-root__control-button" onClick={handleFullClick} aria-label="Full Width View" title="Full Width View">
          <svg viewBox="0 0 24 24" className="xpack-o-root__control-svg">
            <use xlinkHref="/assets/images/root.svg#hay"></use>
          </svg>
        </button>
        <button className="xpack-o-root__control-button" onClick={handleRandomClick} aria-label="Random Width View" title="Random Width View">
          <svg viewBox="0 0 24 24" className="xpack-o-root__control-svg">
            <use xlinkHref="/assets/images/root.svg#random"></use>
          </svg>
        </button>
        <button className="xpack-o-root__control-button" onClick={handleDiscoClick} aria-label="Disco Mode View" title="Disco Mode View">
          <svg viewBox="0 0 24 24" className="xpack-o-root__control-svg">
            <use xlinkHref="/assets/images/root.svg#disco-ball"></use>
          </svg>
        </button>
      </div>
    </div>
  );
}
