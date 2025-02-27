
import { useState, useEffect } from "react";
import { Genre, SearchFilters } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Filter, X, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

interface SearchFiltersProps {
  initialFilters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const ALL_GENRES: Genre[] = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller'
];

export default function SearchFiltersComponent({ 
  initialFilters, 
  onFilterChange 
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Apply the filters when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters.query]);
  
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, query: e.target.value });
  };
  
  const toggleGenre = (genre: Genre) => {
    if (filters.genres.includes(genre)) {
      setFilters({
        ...filters,
        genres: filters.genres.filter((g) => g !== genre),
      });
    } else {
      setFilters({
        ...filters,
        genres: [...filters.genres, genre],
      });
    }
  };
  
  const handleStatusChange = (status: string) => {
    setFilters({
      ...filters,
      status: status === "all" ? undefined : (status as 'ongoing' | 'completed' | 'hiatus'),
    });
  };
  
  const handleSortChange = (sortBy: string) => {
    setFilters({
      ...filters,
      sortBy: sortBy as 'popularity' | 'latest' | 'alphabetical',
    });
  };
  
  const applyFilters = () => {
    onFilterChange(filters);
    setShowMobileFilters(false);
  };
  
  const clearFilters = () => {
    const clearedFilters = {
      ...filters,
      genres: [],
      status: undefined,
      sortBy: 'popularity',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  
  return (
    <div className="w-full">
      {/* Search input - always visible */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search manga..."
          value={filters.query}
          onChange={handleQueryChange}
          className="w-full bg-white/5 border-white/20 text-white placeholder:text-white/60 pr-10"
        />
        {filters.query && (
          <button
            onClick={() => setFilters({ ...filters, query: '' })}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white/90 font-medium">Filters</h3>
          
          {(filters.genres.length > 0 || filters.status || filters.sortBy !== 'popularity') && (
            <button
              onClick={clearFilters}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        
        {/* Sort */}
        <div className="mb-6">
          <label className="block text-sm text-white/70 mb-2">Sort by</label>
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/20">
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm text-white/70 mb-2">Status</label>
          <Select 
            value={filters.status || "all"} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/20">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="hiatus">Hiatus</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Genres */}
        <div className="mb-6">
          <label className="block text-sm text-white/70 mb-2">Genres</label>
          <div className="flex flex-wrap gap-2">
            {ALL_GENRES.map((genre) => {
              const isSelected = filters.genres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    isSelected
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Apply button for desktop */}
        <Button
          onClick={() => onFilterChange(filters)}
          className="w-full bg-white text-black hover:bg-white/90"
        >
          Apply Filters
        </Button>
      </div>

      {/* Mobile filters button and sheet */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          {filters.genres.length > 0 && (
            <Badge variant="outline" className="bg-white/10 text-white">
              {filters.genres.length} genres
            </Badge>
          )}
          
          {filters.status && (
            <Badge variant="outline" className="bg-white/10 text-white">
              {filters.status}
            </Badge>
          )}
          
          {(filters.sortBy !== 'popularity' || filters.genres.length > 0 || filters.status) && (
            <button
              onClick={clearFilters}
              className="text-sm text-white/70 underline"
            >
              Clear
            </button>
          )}
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="border-white/20 text-white">
              <SlidersHorizontal size={16} className="mr-2" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-[#121212] border-white/20 text-white">
            <SheetHeader>
              <SheetTitle className="text-white">Filter Manga</SheetTitle>
              <SheetDescription className="text-white/70">
                Adjust the filters to find the perfect manga.
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-6 space-y-6">
              {/* Sort */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Sort by</label>
                <Select value={filters.sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/20">
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Status</label>
                <Select 
                  value={filters.status || "all"} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/20">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="hiatus">Hiatus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Genres */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Genres</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_GENRES.map((genre) => {
                    const isSelected = filters.genres.includes(genre);
                    return (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                          isSelected
                            ? "bg-white text-black"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        {genre}
                        {isSelected && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  onClick={() => onFilterChange(filters)}
                  className="w-full bg-white text-black hover:bg-white/90"
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
