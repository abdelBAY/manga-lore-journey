
import * as mangaApi from './api/manga';
import * as chaptersApi from './api/chapters';
import * as userApi from './api/user';

// Export all API functions
export const api = {
  // Manga related functions
  getAllManga: mangaApi.getAllManga,
  getRecentlyUpdatedManga: mangaApi.getRecentlyUpdatedManga,
  getMangaById: mangaApi.getMangaById,
  searchManga: mangaApi.searchManga,
  
  // Chapter related functions
  getChaptersByMangaId: chaptersApi.getChaptersByMangaId,
  getChapterById: chaptersApi.getChapterById,
  
  // User related functions
  login: userApi.login,
  register: userApi.register,
  logout: userApi.logout,
  getCurrentUser: userApi.getCurrentUser,
  addFavorite: userApi.addFavorite,
  removeFavorite: userApi.removeFavorite,
  getFavorites: userApi.getFavorites
};

