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
    createHandoffToken: `${DB_API}auth/create-handoff-token/`,
    exchangeHandoffToken: `${DB_API}auth/exchange-handoff-token/`,
    readingPreferencesUpdate: `${DB_API}user/reading-preferences/`,
  },
  // Books
  books: {
    public: `${DB_API}books/public/books/`,
    single: (id) => `${DB_API}books/public/books/${id}/`,
    referenceData: `${DB_API}books/public/books/reference-data/`,
    authorDetail: (username) => `${DB_API}public/authors/${username}/`,
  },
  // Currency
  currency: {
    listQuillBundles: `${DB_API}currency/quills/bundles/`,
    redeemPromoCode: `${DB_API}currency/promo/redeem/`,
    redeemReferralCode: `${DB_API}currency/referral/redeem/`,
    adminGiftCurrency: `${DB_API}currency/admin/gift/`,
    adminCreatePromoCode: `${DB_API}currency/promo/admin/create/`,
  },
  // Reader
  reader: {
    addBook: `${DB_API}books/reader/library/`,
    readerShelf: `${DB_API}books/reader/library/`,
    stats: `${DB_API}books/reader/stats/`,
    bookDetail: (id) => `${DB_API}books/reader/library/book/${id}/`,
    chapterRead: (chapterId) => `${DB_API}books/reader/chapters/${chapterId}/read/`,
    chapterUnlock: (chapterId) => `${DB_API}books/reader/chapters/${chapterId}/unlock/`,
    setAutoUnlock: (bookId) => `${DB_API}books/reader/library/book/${bookId}/auto-unlock/`,
  },
  // Follow Authors
  follow: {
    list: `${DB_API}follow/reader/following/`,
    status: (profileType, profileId) =>
      `${DB_API}follow/reader/following/status/${profileType}/${profileId}/`,
    unfollow: (followId) =>
      `${DB_API}follow/reader/following/${followId}/`,
  },
  // Admin
  admin: {
    listUsers: `${DB_API}admin/users/list/`,
  },
};