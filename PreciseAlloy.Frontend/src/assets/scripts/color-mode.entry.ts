import { THEME_KEY, initTheme, switchTheme } from "@helpers/handleTheme";

initTheme();

/**
 * Handle storage change
 */
const handleStorageChange = (event: StorageEvent) => {
  switch (event.key) {
    case THEME_KEY: {
      document.documentElement.setAttribute('data-theme', event.newValue as string);
      break;
    }
  }
};

const handleToggleTheme = () => {
  switchTheme();
};

const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    switchTheme();
  });
}

window.addEventListener('storage', handleStorageChange);
window.addEventListener('toggleTheme', handleToggleTheme);
