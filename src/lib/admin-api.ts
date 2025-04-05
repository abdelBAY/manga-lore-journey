
import { adminApi } from './admin';

// Re-export all admin API functions
export const {
  fetchAllManga,
  fetchMangaById,
  createManga,
  updateManga,
  deleteManga,
  fetchChaptersByMangaId,
  fetchChapterById,
  createChapter,
  updateChapter,
  deleteChapter
} = adminApi;
