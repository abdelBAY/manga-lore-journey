import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Chapter, Manga, SearchFilters } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function useAllManga() {
  return useQuery({
    queryKey: ["manga"],
    queryFn: api.getAllManga,
  });
}

export function useRecentlyUpdatedManga() {
  return useQuery({
    queryKey: ["manga", "recent"],
    queryFn: api.getRecentlyUpdatedManga,
  });
}

export function useMangaById(id: string) {
  return useQuery({
    queryKey: ["manga", id],
    queryFn: () => api.getMangaById(id),
    enabled: !!id,
  });
}

export function useChaptersByMangaId(mangaId: string) {
  return useQuery({
    queryKey: ["chapters", mangaId],
    queryFn: () => api.getChaptersByMangaId(mangaId),
    enabled: !!mangaId,
  });
}

export function useChapterById(mangaId: string, chapterId: string) {
  return useQuery({
    queryKey: ["chapter", mangaId, chapterId],
    queryFn: () => api.getChapterById(mangaId, chapterId),
    enabled: !!mangaId && !!chapterId,
  });
}

export function useSearchManga(filters: SearchFilters) {
  return useQuery({
    queryKey: ["manga", "search", filters],
    queryFn: () => api.searchManga(filters),
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (mangaId: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          manga_id: mangaId
        });
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          console.log('Manga already in favorites');
          return true; // Already favorite, not an error for the user
        }
        throw error;
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      
      toast({
        title: "Added to Favorites",
        description: "Manga has been added to your favorites",
      });
    },
    onError: (error) => {
      console.error("Error adding favorite:", error);
      toast({
        title: "Error",
        description: "Could not add to favorites. Please try again.",
        variant: "destructive",
      });
    }
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (mangaId: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('manga_id', mangaId);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      
      toast({
        title: "Removed from Favorites",
        description: "Manga has been removed from your favorites",
      });
    },
    onError: (error) => {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Could not remove from favorites. Please try again.",
        variant: "destructive",
      });
    }
  });
}

export function useFavorites() {
  const { user, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!isAuthenticated || !user) return [];
      
      // Get favorite manga IDs
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('manga_id')
        .eq('user_id', user.id);
      
      if (favoritesError) {
        console.error("Error fetching favorites:", favoritesError);
        throw favoritesError;
      }
      
      if (!favorites || favorites.length === 0) return [];
      
      const mangaIds = favorites.map(f => f.manga_id);
      
      // Get manga details for each favorite
      const { data: manga, error: mangaError } = await supabase
        .from('manga')
        .select('*')
        .in('id', mangaIds);
      
      if (mangaError) {
        console.error("Error fetching manga details:", mangaError);
        throw mangaError;
      }
      
      // Transform to our Manga type
      return manga.map(m => ({
        id: m.id,
        title: m.title,
        coverImage: m.cover_image,
        description: m.description,
        status: m.status,
        genres: m.genres,
        author: m.author,
        artist: m.artist,
        releaseYear: m.release_year,
        rating: m.rating
      }));
    },
    enabled: isAuthenticated && !!user
  });
}
