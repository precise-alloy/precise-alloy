declare module '*.svg?raw' {
  const value: string;
  export default value;
}

declare module '*.htm?raw' {
  const value: string;
  export default value;
}

declare module '*.htm?raw' {
  const value: string;
  export default value;
}

declare module '*.cshtml?raw' {
  const value: string;
  export default value;
}

declare module '*.svg?raw' {
  const value: string;
  export default value;
}

interface Window {
  setFavoriteCount: (count: string | number) => void;
  setCartCount: (count: string | number) => void;
  setState: (name: string, value: string) => void;
  renderComponents: () => void;
  getCookie: (name: string) => string | undefined;

  appApi: {
    getAsync: <T>(remain: string, params?: RequestParams) => Promise<T>;
    postAsync: <T>(remain: string, params?: RequestParams, body?: unknown, skipResponseBody?: boolean) => Promise<T>;
    putAsync: <T>(remain: string, params?: RequestParams, body?: unknown, skipResponseBody?: boolean) => Promise<T>;
    patchAsync: <T>(remain: string, params?: RequestParams, body?: unknown, skipResponseBody?: boolean) => Promise<T>;
    deleteAsync: <T>(remain: string, params?: RequestParams, body?: unknown, skipResponseBody?: boolean) => Promise<T>;
  };
}

declare const viteAbsoluteUrl: (path: string, addExtension?: boolean) => string;
declare const getModifiers: (model: BasedAtomicModel, baseClass: string) => string;

interface Element {
  observeResize: (callback: () => void) => void;
}

interface HTMLElement {
  onOutsideClick: (handler: (e: MouseEvent | TouchEvent) => void, otherDependenceElement?: HTMLElement[]) => void;
}

enum Method {
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
