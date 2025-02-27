
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Chapter, Manga, SearchFilters } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

export function useAllManga() {
  return useQuery({
    queryKey: ["manga"],
    queryFn: api.getAllManga,
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

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: api.getFavorites,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mangaId: string) => api.addFavorite(mangaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({
        title: "Success",
        description: "Added to favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive",
      });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mangaId: string) => api.removeFavorite(mangaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({
        title: "Success",
        description: "Removed from favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    },
  });
}
