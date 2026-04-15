declare module '*.svg?raw' {
  const value: string;
  export default value;
}

declare module '*.htm?raw' {
  const value: string;
  export default value;
}

declare const CONTENT: {
  forgotpassword_link: string;
  createaccount_intro: string;
  button_signin: string;
  social_intro: string;
  remember_me: string;
  unknown_error: string;
  divider_title: string;
  local_intro_email: string;
  logonIdentifier_email: string;
  requiredField_email: string;
  invalid_email: string;
  email_pattern: string;
  local_intro_username: string;
  logonIdentifier_username: string;
  requiredField_username: string;
  password: string;
  requiredField_password: string;
  createaccount_link: string;
  cancel_message: string;
  invalid_password: string;
  createaccount_one_link: string;
  createaccount_two_links: string;
  createaccount_three_links: string;
  local_intro_generic: string;
  requiredField_generic: string;
  invalid_generic: string;
  heading: string;
};

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
  generatePagingData: (numberPages: number, currentPage: number, range?: number) => number[];
  roundNumber: (num: number | boolean | undefined | string | null, numberDecimalDigit?: number) => string;

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
