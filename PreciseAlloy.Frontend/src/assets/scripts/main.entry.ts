window.setState = window.setState || function (key: string, value: string) {
  window.localStorage.setItem(key, value);
  window.dispatchEvent(new StorageEvent('storage', { key, newValue: value }));
};

Element.prototype.observeResize =
  Element.prototype.observeResize ||
  function (callback) {
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