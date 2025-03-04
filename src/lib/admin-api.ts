
import { supabase } from './supabase';
import { AdminMangaFormData, AdminChapterFormData, Manga, Chapter } from './types';
import { toast } from '@/hooks/use-toast';
import { api } from './api';

// Manga CRUD operations
export const fetchAllManga = async (): Promise<Manga[]> => {
  try {
    const { data, error } = await supabase
      .from('manga')
      .select('*');
    
    if (error) {
      console.error('Error fetching manga from Supabase:', error);
      console.log('Falling back to mock data');
      return await api.getAllManga();
    }
    
    if (!data || data.length === 0) {
      console.log('No data from Supabase, using mock data instead');
      return await api.getAllManga();
    }
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      coverImage: item.cover_image,
      description: item.description,
      status: item.status,
      genres: item.genres,
      author: item.author,
      artist: item.artist,
      releaseYear: item.release_year,
      rating: item.rating
    }));
  } catch (err) {
    console.error('Error in fetchAllManga:', err);
    return await api.getAllManga();
  }
};

export const fetchMangaById = async (id: string): Promise<Manga | null> => {
  try {
    const { data, error } = await supabase
      .from('manga')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching manga by id from Supabase:', error);
      const mockManga = await api.getMangaById(id);
      return mockManga;
    }
    
    if (!data) {
      return await api.getMangaById(id);
    }
    
    return {
      id: data.id,
      title: data.title,
      coverImage: data.cover_image,
      description: data.description,
      status: data.status,
      genres: data.genres,
      author: data.author,
      artist: data.artist,
      releaseYear: data.release_year,
      rating: data.rating
    };
  } catch (err) {
    console.error('Error in fetchMangaById:', err);
    return await api.getMangaById(id);
  }
};

export const createManga = async (mangaData: AdminMangaFormData): Promise<Manga | null> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('manga')
    .insert({
      title: mangaData.title,
      cover_image: mangaData.coverImage,
      description: mangaData.description,
      status: mangaData.status,
      genres: mangaData.genres,
      author: mangaData.author,
      artist: mangaData.artist,
      release_year: mangaData.releaseYear,
      rating: mangaData.rating,
      created_at: now,
      updated_at: now
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating manga:', error);
    toast({
      title: 'Error',
      description: 'Failed to create manga: ' + error.message,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Manga created successfully',
  });
  
  return {
    id: data.id,
    title: data.title,
    coverImage: data.cover_image,
    description: data.description,
    status: data.status,
    genres: data.genres,
    author: data.author,
    artist: data.artist,
    releaseYear: data.release_year,
    rating: data.rating
  };
};

export const updateManga = async (id: string, mangaData: AdminMangaFormData): Promise<Manga | null> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('manga')
    .update({
      title: mangaData.title,
      cover_image: mangaData.coverImage,
      description: mangaData.description,
      status: mangaData.status,
      genres: mangaData.genres,
      author: mangaData.author,
      artist: mangaData.artist,
      release_year: mangaData.releaseYear,
      rating: mangaData.rating,
      updated_at: now
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating manga:', error);
    toast({
      title: 'Error',
      description: 'Failed to update manga: ' + error.message,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Manga updated successfully',
  });
  
  return {
    id: data.id,
    title: data.title,
    coverImage: data.cover_image,
    description: data.description,
    status: data.status,
    genres: data.genres,
    author: data.author,
    artist: data.artist,
    releaseYear: data.release_year,
    rating: data.rating
  };
};

export const deleteManga = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('manga')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting manga:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete manga: ' + error.message,
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Success',
    description: 'Manga deleted successfully',
  });
  
  return true;
};

// Chapter CRUD operations
export const fetchChaptersByMangaId = async (mangaId: string): Promise<Chapter[]> => {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('manga_id', mangaId)
    .order('number', { ascending: true });
  
  if (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
  
  return (data || []).map(item => ({
    id: item.id,
    mangaId: item.manga_id,
    number: item.number,
    title: item.title,
    releaseDate: item.release_date,
    pages: item.pages
  }));
};

export const fetchChapterById = async (id: string): Promise<Chapter | null> => {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching chapter by id:', error);
    return null;
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    mangaId: data.manga_id,
    number: data.number,
    title: data.title,
    releaseDate: data.release_date,
    pages: data.pages
  };
};

export const createChapter = async (chapterData: AdminChapterFormData): Promise<Chapter | null> => {
  const { data, error } = await supabase
    .from('chapters')
    .insert({
      manga_id: chapterData.mangaId,
      number: chapterData.number,
      title: chapterData.title,
      release_date: chapterData.releaseDate,
      pages: chapterData.pages
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating chapter:', error);
    toast({
      title: 'Error',
      description: 'Failed to create chapter: ' + error.message,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Chapter created successfully',
  });
  
  return {
    id: data.id,
    mangaId: data.manga_id,
    number: data.number,
    title: data.title,
    releaseDate: data.release_date,
    pages: data.pages
  };
};

export const updateChapter = async (id: string, chapterData: AdminChapterFormData): Promise<Chapter | null> => {
  const { data, error } = await supabase
    .from('chapters')
    .update({
      manga_id: chapterData.mangaId,
      number: chapterData.number,
      title: chapterData.title,
      release_date: chapterData.releaseDate,
      pages: chapterData.pages,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating chapter:', error);
    toast({
      title: 'Error',
      description: 'Failed to update chapter: ' + error.message,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Chapter updated successfully',
  });
  
  return {
    id: data.id,
    mangaId: data.manga_id,
    number: data.number,
    title: data.title,
    releaseDate: data.release_date,
    pages: data.pages
  };
};

export const deleteChapter = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('chapters')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting chapter:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete chapter: ' + error.message,
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Success',
    description: 'Chapter deleted successfully',
  });
  
  return true;
};
