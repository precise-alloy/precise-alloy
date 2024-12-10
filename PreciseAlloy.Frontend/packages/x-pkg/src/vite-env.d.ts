/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_PORT: number;
  readonly VITE_PATH_EXTENSION: string;
  readonly VITE_TITLE_SUFFIX: string;
  readonly VITE_DOMAIN: string;
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_API_FAVORITE_URL: string;
  readonly VITE_APP_API_PRODUCT_CART_URL: string;
  readonly VITE_APP_API_PRODUCT_PRICE_URL: string;
  readonly VITE_APP_API_SEARCH_AUTOCOMPLETE: string;
  readonly VITE_APP_API_SPACE_REQUIREMENT: string;
  readonly VITE_INTE_ASSET_DIR: string;
  readonly VITE_INTE_PATTERN_DIR: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
