
import { supabase } from '../supabase';
import { AdminMangaFormData, Manga } from '../types';
import { toast } from '@/hooks/use-toast';
import { api } from '../api';

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
