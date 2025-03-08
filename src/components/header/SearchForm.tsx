
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  handleSearch: (e: React.FormEvent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchForm({ handleSearch, searchQuery, setSearchQuery }: SearchFormProps) {
  return (
    <form onSubmit={handleSearch} className="relative w-64">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
      <Input
        type="search"
        placeholder="Search manga..."
        className="w-full pl-10 bg-white/5 border-white/10 text-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
}
