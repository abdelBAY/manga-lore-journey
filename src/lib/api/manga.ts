
import { Manga, SearchFilters } from '../types';
import { MOCK_MANGA } from './mock-data';
import { delay } from './utils';

export async function getAllManga(): Promise<Manga[]> {
  await delay(800);
  return MOCK_MANGA;
}

export async function getRecentlyUpdatedManga(): Promise<Manga[]> {
  await delay(800);
  // For mock data, we'll modify to include both recently created and updated manga
  // In a real API, this would fetch manga sorted by creation or update timestamp
  
  // First, make a copy and shuffle it to simulate random sorting
  const shuffled = [...MOCK_MANGA].sort(() => 0.5 - Math.random());
  
  // Then sort by release year (as a proxy for creation date in our mock data)
  // This ensures newer manga (by release year) appears in the recently updated section
  return shuffled
    .sort((a, b) => b.releaseYear - a.releaseYear)
    .slice(0, 10);
}

export async function getMangaById(id: string): Promise<Manga | null> {
  await delay(500);
  return MOCK_MANGA.find(manga => manga.id === id) || null;
}

export async function searchManga(filters: SearchFilters): Promise<Manga[]> {
  await delay(1000);
  let results = [...MOCK_MANGA];
  
  // Filter by search query
  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter(manga => 
      manga.title.toLowerCase().includes(query) || 
      manga.description.toLowerCase().includes(query)
    );
  }
  
  // Filter by genres
  if (filters.genres.length > 0) {
    results = results.filter(manga => 
      filters.genres.some(genre => manga.genres.includes(genre))
    );
  }
  
  // Filter by status
  if (filters.status) {
    results = results.filter(manga => manga.status === filters.status);
  }
  
  // Sort results
  switch (filters.sortBy) {
    case 'popularity':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'latest':
      results.sort((a, b) => b.releaseYear - a.releaseYear);
      break;
    case 'alphabetical':
      results.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  
  return results;
}
