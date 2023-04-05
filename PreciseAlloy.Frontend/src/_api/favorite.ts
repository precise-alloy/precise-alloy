import { SearchResultListModel } from '@_types/types';
import { getAsync, postAsync } from './_base';

const favoriteApiUrl = import.meta.env.VITE_APP_API_FAVORITE_URL;

const getFavoriteAsync = (page: string, size: string) => {
  return getAsync(favoriteApiUrl, { page, size });
};

export const toggleFavoriteAsync = (productId: string, confirmFavorite: boolean) => {
  return postAsync(favoriteApiUrl, {}, { productId, confirmFavorite });
};

export const addFavoriteAsync = (productId: string) => {
  return postAsync(favoriteApiUrl, {}, { productId, confirmFavorite: true });
};

export const removeFavoriteAsync = (productId: string) => {
  return postAsync(favoriteApiUrl, {}, { productId, confirmFavorite: false });
};

export const getFavorites = async (page: number, size: number = 6) => {
  const data = await getFavoriteAsync(page + '', size + '');
  return data as SearchResultListModel;
};
