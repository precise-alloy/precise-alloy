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
    setState: (name: string, value: string) => void;
  }

  interface Element {
    observeResize: (callback: () => void) => void;
  }

  interface HTMLElement {
    onOutsideClick: (hanller: (e) => void, otherDependenceElement?: HTMLElement[]) => void;
  }
}

export interface RootItemModel {
  name: string;
  path: string;
}

export interface RootModel {
  routes: RootItemModel[];
}

