
export interface Manga {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  genres: string[];
  author: string;
  artist: string;
  releaseYear: number;
  rating: number;
}

export interface Chapter {
  id: string;
  mangaId: string;
  number: number;
  title: string;
  releaseDate: string;
  pages: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  favorites: string[];
  role?: 'user' | 'admin';
}

export type Genre = 
  | 'Action'
  | 'Adventure'
  | 'Comedy'
  | 'Drama'
  | 'Fantasy'
  | 'Horror'
  | 'Mystery'
  | 'Romance'
  | 'Sci-Fi'
  | 'Slice of Life'
  | 'Sports'
  | 'Supernatural'
  | 'Thriller';

export interface SearchFilters {
  query: string;
  genres: Genre[];
  status?: 'ongoing' | 'completed' | 'hiatus';
  sortBy: 'popularity' | 'latest' | 'alphabetical';
}

export interface AdminMangaFormData {
  title: string;
  coverImage: string;
  description: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  genres: Genre[];
  author: string;
  artist: string;
  releaseYear: number;
  rating: number;
}

export interface AdminChapterFormData {
  mangaId: string;
  number: number;
  title: string;
  releaseDate: string;
  pages: string[];
}
