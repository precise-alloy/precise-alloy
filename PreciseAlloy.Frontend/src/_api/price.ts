import { getAsync } from './_base';

const productPriceApiUrl = import.meta.env.VITE_APP_API_PRODUCT_PRICE_URL;

export const getAllProductPrices = () => {
  return getAsync(productPriceApiUrl);
};

export const getProductPrice = (code: string) => {
  return getAsync(productPriceApiUrl + '/' + code);
};
