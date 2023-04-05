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
    setIsTopPanel: (isTopPanel: boolean) => any;
  }

  interface Element {
    observeResize: (callback: () => any) => any;
  }
}
