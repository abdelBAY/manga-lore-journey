
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/auth/useAuth';
import { checkIsAdmin, supabase } from '@/lib/supabase';
import { fetchAllManga, fetchMangaById, createManga, updateManga, deleteManga, 
  fetchChaptersByMangaId, fetchChapterById, createChapter, updateChapter, deleteChapter } from '@/lib/admin-api';
import { AdminMangaFormData, AdminChapterFormData } from '@/lib/types';

export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Checking admin status for user:', user.id);
        const admin = await checkIsAdmin();
        console.log('Admin check result:', admin);
        setIsAdmin(admin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();

    // Set up realtime subscription for user_roles table
    if (user) {
      const channel = supabase
        .channel('user_roles_changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'user_roles',
            filter: `user_id=eq.${user.id}` // Only listen to changes for this user
          },
          (payload) => {
            console.log('Realtime user_roles update:', payload);
            // Recheck admin status when user_roles changes
            checkAdmin();
          }
        )
        .subscribe();

      // Clean up subscription when component unmounts
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return { isAdmin, isLoading };
}

export function useAdminManga() {
  const queryClient = useQueryClient();
  
  const allManga = useQuery({
    queryKey: ['admin', 'manga'],
    queryFn: fetchAllManga,
  });
  
  const getMangaById = (id: string) => {
    return useQuery({
      queryKey: ['admin', 'manga', id],
      queryFn: () => fetchMangaById(id),
      enabled: !!id,
    });
  };
  
  const createMangaMutation = useMutation({
    mutationFn: (data: AdminMangaFormData) => createManga(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'manga'] });
    },
  });
  
  const updateMangaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminMangaFormData }) => updateManga(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'manga'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'manga', variables.id] });
    },
  });
  
  const deleteMangaMutation = useMutation({
    mutationFn: (id: string) => deleteManga(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'manga'] });
    },
  });
  
  return {
    allManga,
    getMangaById,
    createManga: createMangaMutation,
    updateManga: updateMangaMutation,
    deleteManga: deleteMangaMutation,
  };
}

export function useAdminChapters(mangaId?: string) {
  const queryClient = useQueryClient();
  
  const chaptersQuery = useQuery({
    queryKey: ['admin', 'chapters', mangaId],
    queryFn: () => fetchChaptersByMangaId(mangaId || ''),
    enabled: !!mangaId,
  });
  
  const getChapterById = (id: string) => {
    return useQuery({
      queryKey: ['admin', 'chapter', id],
      queryFn: () => fetchChapterById(id),
      enabled: !!id,
    });
  };
  
  const createChapterMutation = useMutation({
    mutationFn: (data: AdminChapterFormData) => createChapter(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'chapters', variables.mangaId] });
    },
  });
  
  const updateChapterMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminChapterFormData }) => updateChapter(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'chapters', variables.data.mangaId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'chapter', variables.id] });
    },
  });
  
  const deleteChapterMutation = useMutation({
    mutationFn: (id: string) => deleteChapter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'chapters'] });
    },
  });
  
  return {
    chapters: chaptersQuery,
    getChapterById,
    createChapter: createChapterMutation,
    updateChapter: updateChapterMutation,
    deleteChapter: deleteChapterMutation,
  };
}
