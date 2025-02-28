
import { Manga } from "@/lib/types";
import MangaCard from "./MangaCard";
import { useAuth } from "@/hooks/useAuth";

interface MangaGridProps {
  manga: Manga[];
  isLoading?: boolean;
  emptyMessage?: string;
  renderOverlay?: (manga: Manga) => React.ReactNode;
}

export default function MangaGrid({ 
  manga, 
  isLoading = false,
  emptyMessage = "No manga found",
  renderOverlay
}: MangaGridProps) {
  const { user } = useAuth();
  const favorites = user?.favorites || [];

  // Create skeleton loaders for when data is loading
  const skeletons = Array.from({ length: 8 }).map((_, i) => (
    <div key={`skeleton-${i}`} className="animate-pulse">
      <div className="aspect-[2/3] bg-white/5 rounded-lg"></div>
      <div className="mt-3 h-5 bg-white/5 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-white/5 rounded w-1/2"></div>
    </div>
  ));

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {skeletons}
      </div>
    );
  }

  if (manga.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-white/70 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {manga.map((item, index) => (
        <div key={item.id} className={`stagger-item animate-fade-in relative`}>
          {renderOverlay && renderOverlay(item)}
          <MangaCard manga={item} isFavorite={favorites.includes(item.id)} />
        </div>
      ))}
    </div>
  );
}
