// utils/mediaUrl.js
const DB_MEDIA = process.env.EXPO_PUBLIC_DB_MEDIA;

export const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${DB_MEDIA}${path}`;
};