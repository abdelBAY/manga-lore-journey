
import { useState } from "react";
import { Link } from "react-router-dom";
import { Manga } from "@/lib/types";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAddFavorite, useRemoveFavorite } from "@/hooks/useManga";
import { Badge } from "@/components/ui/badge";

interface MangaCardProps {
  manga: Manga;
  isFavorite?: boolean;
}

export default function MangaCard({ manga, isFavorite = false }: MangaCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { isAuthenticated } = useAuth();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;

    if (isFavorite) {
      removeFavorite.mutate(manga.id);
    } else {
      addFavorite.mutate(manga.id);
    }
  };

  return (
    <Link to={`/manga/${manga.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg hover-lift">
        <div 
          className={`aspect-[2/3] ${
            isImageLoaded ? "" : "image-loading"
          }`}
        >
          <img
            src={manga.coverImage}
            alt={manga.title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
          <h3 className="text-white font-medium line-clamp-2">{manga.title}</h3>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {manga.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                {genre}
              </Badge>
            ))}
            {manga.genres.length > 2 && (
              <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                +{manga.genres.length - 2}
              </Badge>
            )}
          </div>
          
          <div className="mt-2 text-xs text-white/70">
            {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
          </div>
        </div>
        
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? "bg-white text-red-500"
                : "bg-black/40 text-white/70 opacity-0 group-hover:opacity-100"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      
      <div className="mt-3">
        <h3 className="font-medium text-white line-clamp-1">{manga.title}</h3>
        <p className="text-sm text-white/60 mt-1">{manga.author}</p>
      </div>
    </Link>
  );
}
