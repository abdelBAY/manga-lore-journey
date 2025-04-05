
// Re-export all admin API functions from this file
import * as mangaApi from './manga-api';
import * as chapterApi from './chapter-api';

export const adminApi = {
  // Manga related functions
  fetchAllManga: mangaApi.fetchAllManga,
  fetchMangaById: mangaApi.fetchMangaById,
  createManga: mangaApi.createManga,
  updateManga: mangaApi.updateManga,
  deleteManga: mangaApi.deleteManga,
  
  // Chapter related functions
  fetchChaptersByMangaId: chapterApi.fetchChaptersByMangaId,
  fetchChapterById: chapterApi.fetchChapterById,
  createChapter: chapterApi.createChapter,
  updateChapter: chapterApi.updateChapter,
  deleteChapter: chapterApi.deleteChapter
};
