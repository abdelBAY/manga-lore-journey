
import { Chapter, Manga, User } from '../types';

// Mock data for development purposes
export const MOCK_MANGA: Manga[] = [
  {
    id: '1',
    title: 'Demon Slayer',
    coverImage: 'https://asia.sega.com/kimetsu_hinokami/en/assets/img/sub/news/210625_02.jpg',
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
    coverImage: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._AC_UF1000,1000_QL80_.jpg',
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
    coverImage: 'https://m.media-amazon.com/images/I/71y+XnBXm4L._AC_UF1000,1000_QL80_.jpg',
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
    coverImage: 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974719778/my-hero-academia-vol-26-9781974719778_hr.jpg',
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
    coverImage: 'https://static1.srcdn.com/wordpress/wp-content/uploads/wm/2024/04/yuji-and-sukuna-back-to-back-in-jujutssu-kaisen-with-yuji-surrounded-by-black-flash-sparks-and-sukuna-using-his-fire-arrow-techniqiue.jpg',
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
    coverImage: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2024/04/chainsaw-man-volume-11-cover.jpg',
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
    coverImage: 'https://m.media-amazon.com/images/I/71vMGRog+iL._AC_UF1000,1000_QL80_.jpg',
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
    coverImage: 'https://bang-dream-gbp-en.bushiroad.com/wordpress/wp-content/uploads/1_1200-x-630_new.png',
    description: 'A middle-aged loser travels back in time to save his ex-girlfriend from being murdered by a gang.',
    status: 'completed',
    genres: ['Action', 'Drama', 'Supernatural'],
    author: 'Ken Wakui',
    artist: 'Ken Wakui',
    releaseYear: 2017,
    rating: 4.6
  },
];

export const MOCK_CHAPTERS: { [key: string]: Chapter[] } = {
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
    pages: Array.from({ length: 20 }, (_, j) => `https://source.unsplash.com/random/800x1200/?manga&id=7-${i+1}-${j+1}`)
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
export const MOCK_USERS: User[] = [
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
