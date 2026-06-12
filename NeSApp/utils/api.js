// utils/api.js
const DB_API = process.env.EXPO_PUBLIC_DB_API;

export const ENDPOINTS = {
  // Auth
  auth: {
    login: `${DB_API}auth/login/`,
    register: `${DB_API}auth/register/`,
    logout: `${DB_API}auth/logout/`,
    refresh: `${DB_API}auth/token/refresh/`,
    me: `${DB_API}auth/me/`,
  },
  // Books
  books: {
    public: `${DB_API}books/public/books/`,
    referenceData: `${DB_API}books/reference-data/`,
  },
};