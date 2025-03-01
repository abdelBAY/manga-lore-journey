
import { Chapter } from '../types';
import { MOCK_CHAPTERS } from './mock-data';
import { delay } from './utils';

export async function getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
  await delay(700);
  return MOCK_CHAPTERS[mangaId] || [];
}

export async function getChapterById(mangaId: string, chapterId: string): Promise<Chapter | null> {
  await delay(500);
  const chapters = MOCK_CHAPTERS[mangaId] || [];
  return chapters.find(chapter => chapter.id === chapterId) || null;
}
