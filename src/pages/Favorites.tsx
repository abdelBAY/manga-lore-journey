import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "@/components/Header";
import MangaGrid from "@/components/MangaGrid";
import { useFavorites } from "@/hooks/useManga";
import { useAuth } from "@/hooks/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Favorites() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: favorites, isLoading: isFavoritesLoading } = useFavorites();
  
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isAuthLoading, navigate]);
  
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderComponent />
        <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <HeaderComponent />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">My Favorites</h1>
          <p className="text-white/70">Manga you've marked as favorites appear here.</p>
        </div>
        
        {isFavoritesLoading ? (
          <MangaGrid manga={[]} isLoading={true} />
        ) : favorites && favorites.length > 0 ? (
          <MangaGrid manga={favorites} />
        ) : (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto mb-6 text-white/30" />
            <h2 className="text-xl font-medium text-white mb-2">No favorites yet</h2>
            <p className="text-white/70 mb-6">
              Add manga to your favorites to see them here.
            </p>
            <Button
              onClick={() => navigate("/search")}
              className="bg-white text-black hover:bg-white/90"
            >
              Browse Manga
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
