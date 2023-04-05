import { deleteAsync, postAsync, putAsync } from './_base';

const productCartApiUrl = import.meta.env.VITE_APP_API_PRODUCT_CART_URL;

export const addFavoriteToCart = (code: string, quantity?: number) => {
  return postAsync(productCartApiUrl, {}, { code, quantity: quantity ?? 1 });
};

export const removeCartItemAsync = (code: string) => {
  let deleteUrl = productCartApiUrl + '/' + code;
  return deleteAsync(deleteUrl);
};

export const updateCartItemAsync = (code: string, quantity?: number) => {
  return putAsync(productCartApiUrl, {}, { code, quantity: quantity ?? 1 });
};
