
import { Chapter, Manga, SearchFilters, User } from './types';

// Mock data for development purposes
const MOCK_MANGA: Manga[] = [
  {
    id: '1',
    title: 'Demon Slayer',
    coverImage: 'https://source.unsplash.com/random/300x450/?manga',
    description: 'A young man\'s family is slaughtered by demons and his sister is turned into one. He vows to avenge his family and cure his sister.',
    status: 'completed',
    genres: ['Action', 'Adventure', 'Fantasy', 'Supernatural'],
    author: 'Koyoharu Gotouge',
    artist: 'Koyoharu Gotouge',
    releaseYear: 2016,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Attack on Titan',
    coverImage: 'https://source.unsplash.com/random/300x450/?manga&id=2',
    description: 'In a world where humanity resides within enormous walled cities to protect themselves from Titans, giant humanoid creatures who devour humans seemingly without reason.',
    status: 'completed',
    genres: ['Action', 'Drama', 'Fantasy', 'Mystery'],
    author: 'Hajime Isayama',
    artist: 'Hajime Isayama',
    releaseYear: 2009,
    rating: 4.9
  },
  {
    id: '3',
    title: 'One Piece',
    coverImage: 'https://source.unsplash.com/random/300x450/?manga&id=3',
    description: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.',
    status: 'ongoing',
    genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
    author: 'Eiichiro Oda',
    artist: 'Eiichiro Oda',
    releaseYear: 1997,
    rating: 4.9
  },
  {
    id: '4',
    title: 'My Hero Academia',
    coverImage: 'https://source.unsplash.com/random/300x450/?manga&id=4',
    description: 'A superhero-loving boy without any powers enrolls in a prestigious hero academy and learns what it really means to be a hero.',
    status: 'ongoing',
    genres: ['Action', 'Adventure', 'Comedy', 'Supernatural'],
    author: 'Kohei Horikoshi',
    artist: 'Kohei Horikoshi',
    releaseYear: 2014,
    rating: 4.7
  },
  {
    id: '5',
    title: 'Jujutsu Kaisen',
    coverImage: 'https://source.unsplash.com/random/300x450/?manga&id=5',
    description: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demon\'s other body parts and thus exorcise himself.',
    status: 'ongoing',
    genres: ['Action', 'Supernatural', 'Horror'],
    author: 'Gege Akutami',
    artist: 'Gege Akutami',
    releaseYear: 2018,
    rating: 4.8
  },
  {
    id: '6',
    title: 'Chainsaw Man',
    coverImage: 'https://source.unsplash.com/random/300x450/?manga&id=6',
    description: 'Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes. This is a far cry from reality, however, as Denji is forced by the yakuza to kill devils to clear his crushing debts.',
    status: 'ongoing',
    genres: ['Action', 'Horror', 'Supernatural'],
    author: 'Tatsuki Fujimoto',
    artist: 'Tatsuki Fujimoto',
    releaseYear: 2018,
    rating: 4.9
  },
  {
    id: '7',
    title: 'Spy x Family',
    coverImage: 'https://source.unsplash.com/random/300x450/?manga&id=7',
    description: 'A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must strive to keep together.',
    status: 'ongoing',
    genres: ['Action', 'Comedy', 'Slice of Life'],
    author: 'Tatsuya Endo',
    artist: 'Tatsuya Endo',
    releaseYear: 2019,
    rating: 4.7
  },
  {
    id: '8',
    title: 'Tokyo Revengers',
    coverImage: 'https://source.unsplash.com/random/300x450/?manga&id=8',
    description: 'A middle-aged loser travels back in time to save his ex-girlfriend from being murdered by a gang.',
    status: 'completed',
    genres: ['Action', 'Drama', 'Supernatural'],
    author: 'Ken Wakui',
    artist: 'Ken Wakui',
    releaseYear: 2017,
    rating: 4.6
  },
];

const MOCK_CHAPTERS: { [key: string]: Chapter[] } = {
  '1': Array.from({ length: 20 }, (_, i) => ({
    id: `1-${i+1}`,
    mangaId: '1',
    number: i+1,
    title: `Chapter ${i+1}`,
    releaseDate: new Date(2020, i % 12, i + 1).toISOString(),
    pages: Array.from({ length: 20 }, (_, j) => `https://source.unsplash.com/random/800x1200/?manga&id=1-${i+1}-${j+1}`)
  })),
  '2': Array.from({ length: 15 }, (_, i) => ({
    id: `2-${i+1}`,
    mangaId: '2',
    number: i+1,
    title: `Chapter ${i+1}`,
    releaseDate: new Date(2020, i % 12, i + 1).toISOString(),
    pages: Array.from({ length: 20 }, (_, j) => `https://source.unsplash.com/random/800x1200/?manga&id=2-${i+1}-${j+1}`)
  })),
  '3': Array.from({ length: 25 }, (_, i) => ({
    id: `3-${i+1}`,
    mangaId: '3',
    number: i+1,
    title: `Chapter ${i+1}`,
    releaseDate: new Date(2020, i % 12, i + 1).toISOString(),
    pages: Array.from({ length: 20 }, (_, j) => `https://source.unsplash.com/random/800x1200/?manga&id=3-${i+1}-${j+1}`)
  })),
  '4': Array.from({ length: 18 }, (_, i) => ({
    id: `4-${i+1}`,
    mangaId: '4',
    number: i+1,
    title: `Chapter ${i+1}`,
    releaseDate: new Date(2020, i % 12, i + 1).toISOString(),
    pages: Array.from({ length: 20 }, (_, j) => `https://source.unsplash.com/random/800x1200/?manga&id=4-${i+1}-${j+1}`)
  })),
  '5': Array.from({ length: 22 }, (_, i) => ({
    id: `5-${i+1}`,
    mangaId: '5',
    number: i+1,
    title: `Chapter ${i+1}`,
    releaseDate: new Date(2020, i % 12, i + 1).toISOString(),
    pages: Array.from({ length: 20 }, (_, j) => `https://source.unsplash.com/random/800x1200/?manga&id=5-${i+1}-${j+1}`)
  })),
  '6': Array.from({ length: 16 }, (_, i) => ({
    id: `6-${i+1}`,
    mangaId: '6',
    number: i+1,
    title: `Chapter ${i+1}`,
    releaseDate: new Date(2020, i % 12, i + 1).toISOString(),
    pages: Array.from({ length: 20 }, (_, j) => `https://source.unsplash.com/random/800x1200/?manga&id=6-${i+1}-${j+1}`)
  })),
  '7': Array.from({ length: 14 }, (_, i) => ({
    id: `7-${i+1}`,
    mangaId: '7',
    number: i+1,
    title: `Chapter ${i+1}`,
    releaseDate: new Date(2020, i % 12, i + 1).toISOString(),
    pages: Array.from({ length:
    20 }, (_, j) => `https://source.unsplash.com/random/800x1200/?manga&id=7-${i+1}-${j+1}`)
  })),
  '8': Array.from({ length: 19 }, (_, i) => ({
    id: `8-${i+1}`,
    mangaId: '8',
    number: i+1,
    title: `Chapter ${i+1}`,
    releaseDate: new Date(2020, i % 12, i + 1).toISOString(),
    pages: Array.from({ length: 20 }, (_, j) => `https://source.unsplash.com/random/800x1200/?manga&id=8-${i+1}-${j+1}`)
  })),
};

// Mock users
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'user1',
    email: 'user1@example.com',
    favorites: ['1', '3', '5']
  },
  {
    id: '2',
    username: 'user2',
    email: 'user2@example.com',
    favorites: ['2', '4', '6']
  }
];

// Simulate local storage for user session
let currentUser: User | null = null;

// Simulate API calls with delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Manga related functions
  async getAllManga(): Promise<Manga[]> {
    await delay(800);
    return MOCK_MANGA;
  },

  async getMangaById(id: string): Promise<Manga | null> {
    await delay(500);
    return MOCK_MANGA.find(manga => manga.id === id) || null;
  },

  async getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
    await delay(700);
    return MOCK_CHAPTERS[mangaId] || [];
  },

  async getChapterById(mangaId: string, chapterId: string): Promise<Chapter | null> {
    await delay(500);
    const chapters = MOCK_CHAPTERS[mangaId] || [];
    return chapters.find(chapter => chapter.id === chapterId) || null;
  },

  async searchManga(filters: SearchFilters): Promise<Manga[]> {
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
  },
  
  // User related functions
  async login(email: string, password: string): Promise<User | null> {
    await delay(800);
    // Simple mock authentication - in a real app, this would verify credentials
    const user = MOCK_USERS.find(user => user.email === email);
    if (user) {
      currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    return null;
  },
  
  async register(username: string, email: string, password: string): Promise<User | null> {
    await delay(1000);
    // Check if email is already taken
    if (MOCK_USERS.some(user => user.email === email)) {
      return null;
    }
    
    // Create new user
    const newUser: User = {
      id: `user${MOCK_USERS.length + 1}`,
      username,
      email,
      favorites: []
    };
    
    MOCK_USERS.push(newUser);
    currentUser = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  },
  
  async logout(): Promise<void> {
    await delay(300);
    currentUser = null;
    localStorage.removeItem('user');
  },
  
  async getCurrentUser(): Promise<User | null> {
    await delay(300);
    if (currentUser) return currentUser;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    }
    
    return null;
  },
  
  async addFavorite(mangaId: string): Promise<boolean> {
    await delay(500);
    if (!currentUser) return false;
    
    const userIndex = MOCK_USERS.findIndex(user => user.id === currentUser?.id);
    if (userIndex === -1) return false;
    
    if (!MOCK_USERS[userIndex].favorites.includes(mangaId)) {
      MOCK_USERS[userIndex].favorites.push(mangaId);
      currentUser = MOCK_USERS[userIndex];
      localStorage.setItem('user', JSON.stringify(currentUser));
    }
    
    return true;
  },
  
  async removeFavorite(mangaId: string): Promise<boolean> {
    await delay(500);
    if (!currentUser) return false;
    
    const userIndex = MOCK_USERS.findIndex(user => user.id === currentUser?.id);
    if (userIndex === -1) return false;
    
    MOCK_USERS[userIndex].favorites = MOCK_USERS[userIndex].favorites.filter(id => id !== mangaId);
    currentUser = MOCK_USERS[userIndex];
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    return true;
  },
  
  async getFavorites(): Promise<Manga[]> {
    await delay(700);
    if (!currentUser) return [];
    
    return MOCK_MANGA.filter(manga => currentUser?.favorites.includes(manga.id));
  }
};
