const BORDER_SIZE = 20;
const MIN_FRAME_SIZE = 350;

let orgWidth: number;
let pos: number;

const wrapper = document.getElementById('root-iframe-wrapper')!;
const frame = document.getElementById('root-iframe')!;
const resizer = document.getElementById('root-iframe-resizer')!;
const root = document.getElementById('.xpack-t-root');

const setIFrameWidth = (width?: number) => {
  if (width) {
    wrapper.style.maxWidth = `min(100%, ${width}px)`;
  } else {
    wrapper.style.removeProperty('max-width');
  }
};

const resize = (e: globalThis.MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  e.cancelBubble = true;
  const dx = (e.x - pos) * 2;

  const size = Math.max(MIN_FRAME_SIZE, orgWidth + dx);
  setIFrameWidth(size);

  return false;
};

const mouseUp = () => {
  wrapper.style.removeProperty('transition');
  frame.style.removeProperty('pointer-events');

  document.removeEventListener('mousemove', resize, false);
};

const handleResizerMouseDown = (e: MouseEvent) => {
  if (e.offsetX >= BORDER_SIZE) {
    return;
  }

  wrapper.style.transition = 'none';
  frame.style.pointerEvents = 'none';
  pos = e.x;
  orgWidth = parseInt(getComputedStyle(wrapper, '').width);
  document.addEventListener('mousemove', resize, false);
  document.addEventListener('mouseup', mouseUp, false);
};

const initTopPanel = () => {
  const isTopPanel = localStorage.getItem('MSG_IS_TOP_PANEL') === 'true';
  let rootEl = document.querySelector('.xpack-t-root');

  if (!rootEl) {
    return;
  }
  if (isTopPanel) {
    rootEl.classList.add('top-panel');
  }
};

const handleStoreModified = (event: StorageEvent) => {
  switch (event.key) {
    case 'MSG_IS_TOP_PANEL':
      const isTopPanel = event.newValue === 'true';
      let rootEl = document.querySelector('.xpack-t-root');

      if (!rootEl) {
        return;
      }

      if (isTopPanel) {
        rootEl.classList.add('top-panel');
      } else {
        rootEl.classList.remove('top-panel');
      }
      break;
  }
};

const addStoreEvent = () => {
  window.addEventListener('storage', handleStoreModified);
};

const setup = () => {
  resizer.onmousedown = handleResizerMouseDown;

  const getIFrameActualWidth = () => {
    const el = document.getElementById('root-actual-iframe-width');
    if (el) {
      el.textContent = Math.ceil(parseInt(getComputedStyle(frame).width)) + 'px';
    }
  };

  frame.onload = getIFrameActualWidth;

  if ('ResizeObserver' in window) {
    // create an Observer instance
    const resizeObserver = new ResizeObserver(getIFrameActualWidth);

    // start observing a DOM node
    resizeObserver.observe(frame);
  }
  initTopPanel();
  addStoreEvent();
};

setup();

export { };
