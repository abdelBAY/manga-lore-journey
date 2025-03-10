
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import MangaGrid from "@/components/MangaGrid";
import SearchFiltersComponent from "@/components/SearchFilters";
import { useSearchManga } from "@/hooks/useManga";
import { SearchFilters } from "@/lib/types";

export default function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  // Initial filters
  const initialFilters: SearchFilters = {
    query: initialQuery,
    genres: [],
    sortBy: 'popularity'
  };
  
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const { data: searchResults, isLoading } = useSearchManga(filters);
  
  // Update URL when filters change
  useEffect(() => {
    const queryParams = new URLSearchParams();
    
    if (filters.query) {
      queryParams.set('q', filters.query);
    }
    
    if (filters.genres.length > 0) {
      queryParams.set('genres', filters.genres.join(','));
    }
    
    if (filters.status) {
      queryParams.set('status', filters.status);
    }
    
    queryParams.set('sort', filters.sortBy);
    
    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters, location.pathname]);
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">Search & Filter</h2>
            <SearchFiltersComponent
              initialFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Results */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Results</h2>
              <p className="text-white/70">
                {isLoading
                  ? "Searching..."
                  : searchResults?.length === 0
                  ? "No results found"
                  : `${searchResults?.length} manga found`}
              </p>
            </div>
            
            <MangaGrid
              manga={searchResults || []}
              isLoading={isLoading}
              emptyMessage="No manga found. Try different search terms or filters."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
