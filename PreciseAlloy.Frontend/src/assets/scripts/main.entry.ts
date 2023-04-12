window.setState = window.setState || function (key: string, value: string) {
  window.localStorage.setItem(key, value);
  window.dispatchEvent(new StorageEvent('storage', { key, newValue: value }));
};

Element.prototype.observeResize =
  Element.prototype.observeResize ||
  function (this: Element, callback: () => any) {
    if ('ResizeObserver' in window) {
      // create an Observer instance
      const resizeObserver = new ResizeObserver(callback);

      // start observing a DOM node
      resizeObserver.observe(this);
    } else {
      let lastRect = this.getBoundingClientRect();

      setInterval(() => {
        const rect = this.getBoundingClientRect();
        if (Math.floor(rect.width) != Math.floor(lastRect.width) || Math.floor(rect.height) != Math.floor(lastRect.height)) {
          lastRect = rect;
          callback();
        }
      }, 500);
    }
  };

HTMLElement.prototype.onOutsideClick =
  HTMLElement.prototype.onOutsideClick ||
  function (this: HTMLElement, handler: (e: Event) => any, otherDependenceElement?: HTMLElement[]) {

    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!this || this.contains(event.target)) {
        return;
      }

      if (otherDependenceElement && otherDependenceElement.some((r) => r?.contains(event.target))) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
  }