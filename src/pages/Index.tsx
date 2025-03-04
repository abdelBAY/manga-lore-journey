
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import MangaGrid from "@/components/MangaGrid";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { useAllManga, useRecentlyUpdatedManga } from "@/hooks/useManga";
import { supabase } from "@/lib/supabase";
import { Manga } from "@/lib/types";

export default function Index() {
  const { data: apiManga, isLoading: apiLoading } = useAllManga();
  const { data: apiRecentManga, isLoading: apiRecentLoading } = useRecentlyUpdatedManga();
  const [manga, setManga] = useState<Manga[]>([]);
  const [recentManga, setRecentManga] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredManga, setFeaturedManga] = useState<Manga[]>([]); 
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  
  // Fetch manga from Supabase
  useEffect(() => {
    const fetchManga = async () => {
      setIsLoading(true);
      try {
        // Get all manga from Supabase
        const { data: supabaseManga, error } = await supabase
          .from('manga')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching manga from Supabase:', error);
          // Fallback to API data
          if (apiManga) {
            setManga(apiManga);
            
            // Get random manga for featured section
            const shuffled = [...apiManga].sort(() => 0.5 - Math.random());
            setFeaturedManga(shuffled.slice(0, 1));
            
            // Sort by rating for popular manga
            setPopularManga([...apiManga].sort((a, b) => b.rating - a.rating).slice(0, 5));
          }
          
          if (apiRecentManga) {
            setRecentManga(apiRecentManga);
          }
        } else {
          if (supabaseManga && supabaseManga.length > 0) {
            // Map Supabase data to our Manga type
            const mappedManga: Manga[] = supabaseManga.map(item => ({
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
            
            setManga(mappedManga);
            
            // Get random manga for featured section
            const shuffled = [...mappedManga].sort(() => 0.5 - Math.random());
            setFeaturedManga(shuffled.slice(0, 1));
            
            // Sort by rating for popular manga
            setPopularManga([...mappedManga].sort((a, b) => b.rating - a.rating).slice(0, 5));
            
            // Set recent manga (already sorted by updated_at from the query)
            setRecentManga(mappedManga.slice(0, 5));
          } else {
            // Fallback to API data
            if (apiManga) {
              setManga(apiManga);
              
              // Get random manga for featured section
              const shuffled = [...apiManga].sort(() => 0.5 - Math.random());
              setFeaturedManga(shuffled.slice(0, 1));
              
              // Sort by rating for popular manga
              setPopularManga([...apiManga].sort((a, b) => b.rating - a.rating).slice(0, 5));
            }
            
            if (apiRecentManga) {
              setRecentManga(apiRecentManga);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchManga:', error);
        // Fallback to API data
        if (apiManga) {
          setManga(apiManga);
          
          // Get random manga for featured section
          const shuffled = [...apiManga].sort(() => 0.5 - Math.random());
          setFeaturedManga(shuffled.slice(0, 1));
          
          // Sort by rating for popular manga
          setPopularManga([...apiManga].sort((a, b) => b.rating - a.rating).slice(0, 5));
        }
        
        if (apiRecentManga) {
          setRecentManga(apiRecentManga);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchManga();
  }, [apiManga, apiRecentManga]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pb-16 pt-24">
        {/* Hero section with featured manga */}
        {isLoading ? (
          <div className="w-full aspect-[21/9] rounded-xl animate-pulse bg-white/5 mb-12"></div>
        ) : featuredManga.length > 0 ? (
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-12 animate-scale-in">
            <img
              src={featuredManga[0]?.coverImage}
              alt={featuredManga[0]?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6 md:p-10">
              <div className="max-w-2xl">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm mb-4">
                  Featured
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                  {featuredManga[0]?.title}
                </h1>
                <p className="text-white/80 mb-6 line-clamp-2 md:line-clamp-3">
                  {featuredManga[0]?.description}
                </p>
                <Link to={`/manga/${featuredManga[0]?.id}`}>
                  <Button
                    className="bg-white text-black hover:bg-white/90"
                  >
                    Read Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Popular manga section */}
        <section className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Popular Now</h2>
            <Link to="/search" className="text-white/70 hover:text-white transition-colors flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <MangaGrid 
            manga={popularManga || []} 
            isLoading={isLoading} 
          />
        </section>
        
        <Separator className="my-12 bg-white/10" />
        
        {/* Recently updated section */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recently Updated</h2>
            <Link to="/search" className="text-white/70 hover:text-white transition-colors flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <MangaGrid 
            manga={recentManga || []} 
            isLoading={isLoading || apiRecentLoading} 
          />
        </section>
      </main>
    </div>
  );
}
