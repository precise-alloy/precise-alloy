const avatarApiUrl = import.meta.env.VITE_APP_API_AVATAR_URL;

export const getAllAvatars = () => {
  return window.appApi.getAsync<AvatarModel[]>(avatarApiUrl);
};
