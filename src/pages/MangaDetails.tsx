
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ChapterList from "@/components/ChapterList";
import { useMangaById, useChaptersByMangaId, useAddFavorite, useRemoveFavorite } from "@/hooks/useManga";
import { useAuth } from "@/hooks/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function MangaDetails() {
  const { mangaId } = useParams<{ mangaId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Fetch manga and chapter data
  const { data: manga, isLoading: isLoadingManga } = useMangaById(mangaId || "");
  const { data: chapters, isLoading: isLoadingChapters } = useChaptersByMangaId(mangaId || "");
  
  // Mutations for favorites
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  
  // Check if manga is in user's favorites
  useEffect(() => {
    if (user && mangaId) {
      setIsFavorite(user.favorites.includes(mangaId));
    }
  }, [user, mangaId]);
  
  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add favorites",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (isFavorite) {
      removeFavorite.mutate(mangaId || "");
      setIsFavorite(false);
    } else {
      addFavorite.mutate(mangaId || "");
      setIsFavorite(true);
    }
  };
  
  // Handle read latest chapter
  const handleReadLatest = () => {
    if (chapters && chapters.length > 0) {
      // Sort chapters by number in descending order (newest first)
      const sortedChapters = [...chapters].sort((a, b) => b.number - a.number);
      navigate(`/manga/${mangaId}/chapter/${sortedChapters[0].id}`);
    }
  };
  
  // Loading state
  if (isLoadingManga) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="animate-pulse">
            <div className="w-full h-[300px] rounded-xl bg-white/5 mb-8"></div>
            <div className="h-10 w-3/4 bg-white/5 rounded-lg mb-4"></div>
            <div className="h-6 w-1/2 bg-white/5 rounded-lg mb-6"></div>
            <div className="flex space-x-2 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-20 bg-white/5 rounded-full"></div>
              ))}
            </div>
            <div className="h-40 bg-white/5 rounded-lg mb-8"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Not found state
  if (!manga) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl text-white mb-4">Manga Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline" className="border-white/20 text-white">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        {/* Hero section with cover image */}
        <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-8">
          <div className={isImageLoaded ? "" : "image-loading h-full"} />
          <img
            src={manga.coverImage}
            alt={manga.title}
            className={`w-full h-full object-cover ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left column with cover and info */}
          <div className="md:col-span-1">
            <div className="glass-morphism rounded-xl p-6 animate-fade-in">
              <div className="aspect-[2/3] rounded-lg overflow-hidden mb-6">
                <img
                  src={manga.coverImage}
                  alt={manga.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-white/70 text-sm">Author</h3>
                  <p className="text-white">{manga.author}</p>
                </div>
                
                <div>
                  <h3 className="text-white/70 text-sm">Artist</h3>
                  <p className="text-white">{manga.artist}</p>
                </div>
                
                <div>
                  <h3 className="text-white/70 text-sm">Release Year</h3>
                  <p className="text-white">{manga.releaseYear}</p>
                </div>
                
                <div>
                  <h3 className="text-white/70 text-sm">Status</h3>
                  <p className="text-white capitalize">{manga.status}</p>
                </div>
                
                <div>
                  <h3 className="text-white/70 text-sm">Rating</h3>
                  <p className="text-white">{manga.rating} / 5</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column with details and chapters */}
          <div className="md:col-span-2 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{manga.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {manga.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="bg-white/10 text-white border-white/20">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className={`border-white/20 ${
                    isFavorite
                      ? "bg-white text-black hover:bg-white/90"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={handleFavoriteToggle}
                >
                  <Heart
                    size={16}
                    className="mr-2"
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                  {isFavorite ? "Favorited" : "Add to Favorites"}
                </Button>
                
                <Button
                  className="bg-white text-black hover:bg-white/90"
                  onClick={handleReadLatest}
                  disabled={!chapters || chapters.length === 0}
                >
                  <BookOpen size={16} className="mr-2" />
                  Read Latest
                </Button>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-medium text-white mb-3">Synopsis</h2>
              <p className="text-white/80 leading-relaxed">{manga.description}</p>
            </div>
            
            <Separator className="my-8 bg-white/10" />
            
            <div>
              <h2 className="text-xl font-medium text-white mb-6">Chapters</h2>
              <ChapterList
                chapters={chapters || []}
                mangaId={mangaId || ""}
                isLoading={isLoadingChapters}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
