const THEME_KEY = 'MSG_THEME';

const getTheme = (isLight: boolean) => {
  return isLight ? 'light' : 'dark';
};

const setTheme = (theme: string) => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

const getCurrentTheme = () => {
  const theme = localStorage.getItem(THEME_KEY);

  return getTheme(!theme || theme.toLowerCase() === 'light');
};

const initTheme = () => {
  const theme = getCurrentTheme();

  setTheme(theme);
};

const switchTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = getTheme(currentTheme !== 'light');

  setTheme(newTheme);
}

export { THEME_KEY, getCurrentTheme, initTheme, switchTheme, getTheme, setTheme };