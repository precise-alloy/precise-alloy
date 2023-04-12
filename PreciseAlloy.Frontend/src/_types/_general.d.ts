declare module '*.htm?raw' {
  const value: string;
  export default value;
}

declare module '*.svg?raw' {
  const value: string;
  export default value;
}

export interface BasedAtomicModel {
  globalModifier?: string[];
  styleModifier?: string[];
  theme?: string;
}

declare global {
  interface Window {
    setFavoriteCount: (count: string | number) => any;
    setCartCount: (count: string | number) => any;
    setState: (name: string, value: string) => void;
  }

  interface Element {
    observeResize: (callback: () => any) => any;
  }

  interface HTMLElement {
    onOutsideClick: (hanller: (e) => any, otherDependenceElement?: HTMLElement[]) => any
  }
}
