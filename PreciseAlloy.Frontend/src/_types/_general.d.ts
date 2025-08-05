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
    setFavoriteCount: (count: string | number) => void;
    setCartCount: (count: string | number) => void;
    setState: (name: string, value: string) => void;
    renderComponents: () => void;
  }

  interface Element {
    observeResize: (callback: () => void) => void;
  }

  interface HTMLElement {
    onOutsideClick: (hanller: (e) => void, otherDependenceElement?: HTMLElement[]) => void;
  }
}
