
import { Manga, User } from '../types';
import { MOCK_MANGA, MOCK_USERS } from './mock-data';
import { delay } from './utils';

// Simulate local storage for user session
let currentUser: User | null = null;

export async function login(email: string, password: string): Promise<User | null> {
  await delay(800);
  // Simple mock authentication - in a real app, this would verify credentials
  const user = MOCK_USERS.find(user => user.email === email);
  if (user) {
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
}

export async function register(username: string, email: string, password: string): Promise<User | null> {
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
}

export async function logout(): Promise<void> {
  await delay(300);
  currentUser = null;
  localStorage.removeItem('user');
}

export async function getCurrentUser(): Promise<User | null> {
  await delay(300);
  if (currentUser) return currentUser;
  
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
}

export async function addFavorite(mangaId: string): Promise<boolean> {
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
}

export async function removeFavorite(mangaId: string): Promise<boolean> {
  await delay(500);
  if (!currentUser) return false;
  
  const userIndex = MOCK_USERS.findIndex(user => user.id === currentUser?.id);
  if (userIndex === -1) return false;
  
  MOCK_USERS[userIndex].favorites = MOCK_USERS[userIndex].favorites.filter(id => id !== mangaId);
  currentUser = MOCK_USERS[userIndex];
  localStorage.setItem('user', JSON.stringify(currentUser));
  
  return true;
}

export async function getFavorites(): Promise<Manga[]> {
  await delay(700);
  if (!currentUser) return [];
  
  return MOCK_MANGA.filter(manga => currentUser?.favorites.includes(manga.id));
}
