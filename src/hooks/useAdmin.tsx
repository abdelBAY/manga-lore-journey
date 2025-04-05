
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/auth/useAuth';
import { checkIsAdmin, setUserAdmin } from '@/lib/supabase';
import { 
  fetchAllManga, fetchMangaById, createManga, updateManga, deleteManga, 
  fetchChaptersByMangaId, fetchChapterById, createChapter, updateChapter, deleteChapter 
} from '@/lib/admin-api';
import { AdminMangaFormData, AdminChapterFormData } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export function useIsAdmin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstUser, setIsFirstUser] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      console.log("useIsAdmin: Checking admin status", { user, isAuthenticated, authLoading });
      
      if (authLoading) {
        console.log("useIsAdmin: Auth still loading, waiting...");
        return;
      }
      
      if (!isAuthenticated || !user) {
        console.log("useIsAdmin: User not authenticated");
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log("useIsAdmin: Checking admin role for", user.email);
        const admin = await checkIsAdmin();
        console.log("useIsAdmin: Admin check result:", admin);
        
        // If not admin, try to make first user an admin automatically
        if (!admin) {
          console.log("useIsAdmin: Not an admin, checking if first user");
          try {
            const success = await setUserAdmin(user.email);
            if (success) {
              console.log("useIsAdmin: Successfully made first user an admin");
              setIsAdmin(true);
              setIsFirstUser(true);
              toast({
                title: "Admin Access Granted",
                description: "You have been granted admin privileges as the first user.",
              });
            } else {
              setIsAdmin(false);
            }
          } catch (error) {
            console.error("useIsAdmin: Error making first user admin:", error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(admin);
        }
      } catch (error) {
        console.error('useIsAdmin: Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user, isAuthenticated, authLoading]);

  return { isAdmin, isLoading, isFirstUser };
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
