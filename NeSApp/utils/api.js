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
    updateProfile: `${DB_API}user/profile/update/`,
    adminProfileUpdate: `${DB_API}user/admin-profile/update/`,
    authorProfileUpdate: `${DB_API}user/author-profile/update/`,
    freeAuthorProfileUpdate: `${DB_API}user/free-author-profile/update/`,
    moderatorProfileUpdate: `${DB_API}user/moderator-profile/update/`,
  },
  // Books
  books: {
    public: `${DB_API}books/public/books/`,
    single: (id) => `${DB_API}books/public/books/${id}/`,
    referenceData: `${DB_API}books/public/books/reference-data/`,
  },
  // Reader
  reader: {
    addBook:`${DB_API}books/reader/library/`,
    readerShelf:`${DB_API}books/reader/library/`,
    bookDetail: (id) => `${DB_API}books/reader/library/book/${id}/`,
  },
};