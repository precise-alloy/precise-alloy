import { getAsync } from './_base';

const avatarApiUrl = import.meta.env.VITE_APP_API_AVATAR_URL;

export const getAllAvatars = () => {
  return getAsync(avatarApiUrl);
};
