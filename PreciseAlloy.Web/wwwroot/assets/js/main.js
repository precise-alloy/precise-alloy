window.setState = window.setState || function(t, e) {
  window.localStorage.setItem(t, e), window.dispatchEvent(new StorageEvent("storage", { key: t, newValue: e }));
};
//# sourceMappingURL=main.js.map
