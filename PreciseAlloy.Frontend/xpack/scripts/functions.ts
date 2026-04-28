/* AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
 * Please commit any changes you see here.
 */

type RuntimeGlobal = typeof globalThis & {
  window?: Window & typeof globalThis;
  getModifiers?: (model: BasedAtomicModel, baseClass: string) => string;
  viteAbsoluteUrl?: (path: string, addExtension?: boolean) => string;
};

const runtimeGlobal = globalThis as RuntimeGlobal;
const runtimeWindow = (typeof window !== 'undefined' ? window : runtimeGlobal) as Window & typeof globalThis;

if (typeof window === 'undefined') {
  runtimeGlobal.window = runtimeWindow;
}

runtimeGlobal.getModifiers = (model: BasedAtomicModel, baseClass: string) => {
  const classes = [baseClass];

  model.globalModifier?.forEach((m) => classes.push(m));
  model.styleModifier?.forEach((m) => classes.push(baseClass + '--' + m));

  if (model.theme) {
    classes.push('theme-' + model.theme);
  }

  return classes.join(' ');
};

runtimeGlobal.viteAbsoluteUrl = (path: string, addExtension = false): string => {
  if (/^https?:\/\//gi.test(path)) {
    return path;
  }
  const baseUrl = import.meta.env.BASE_URL;
  const normalizedRemain =
    (path?.startsWith('/') ? path : '/' + path) + (addExtension && !path.endsWith('/') ? import.meta.env.VITE_PATH_EXTENSION : '');

  if (!baseUrl) {
    return normalizedRemain;
  }

  if (!baseUrl.endsWith('/')) {
    return baseUrl + normalizedRemain;
  }

  const len = baseUrl.length;

  return baseUrl.substring(0, len - 1) + normalizedRemain;
};

runtimeWindow.getCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const cookies: { [name: string]: string } = {};

  document.cookie.split(';').forEach((cookie) => {
    const [name, value] = cookie.split('=');

    cookies[name.trim()] = value;
  });

  return cookies[name];
};
