(() => {
  // enforce local storage setting but also fallback to user-agent preferences

  const urlParams = new URLSearchParams(window.location.search);
  const theme = urlParams.get('theme');
  if (theme === 'dark' || theme == 'light') {
    document.documentElement.setAttribute('data-theme', theme);
    return;
  }

  if (localStorage.getItem('theme') === 'dark'
    || (!localStorage.getItem('theme') && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

export { };