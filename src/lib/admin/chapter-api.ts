
import { supabase } from '../supabase';
import { AdminChapterFormData, Chapter } from '../types';
import { toast } from '@/hooks/use-toast';

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
