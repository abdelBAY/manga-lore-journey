
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Heart, BookOpen, Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "glass-morphism shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white flex items-center">
          <BookOpen className="mr-2" />
          <span className="text-gradient">MangaLore</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search manga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
            >
              <Search size={18} />
            </button>
          </form>

          <Link
            to="/search"
            className="text-white/80 hover:text-white transition-colors"
          >
            Browse
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/favorites"
                className="text-white/80 hover:text-white transition-colors flex items-center"
              >
                <Heart size={18} className="mr-1" /> Favorites
              </Link>
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => logout()}
              >
                Logout
              </Button>
              <span className="text-white/90">
                Hi, {user?.username}
              </span>
            </>
          ) : (
            <Link to="/auth">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <User size={18} className="mr-2" /> Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="neo-blur md:hidden px-4 py-5 animate-fade-in">
          <form
            onSubmit={handleSearch}
            className="relative mb-6"
          >
            <Input
              type="text"
              placeholder="Search manga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
            >
              <Search size={18} />
            </button>
          </form>

          <div className="flex flex-col space-y-4">
            <Link
              to="/search"
              className="text-white/80 hover:text-white transition-colors py-2 border-b border-white/10"
            >
              Browse
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="text-white/80 hover:text-white transition-colors py-2 border-b border-white/10 flex items-center"
                >
                  <Heart size={18} className="mr-2" /> Favorites
                </Link>
                <Button
                  variant="ghost"
                  className="text-white/80 hover:text-white transition-colors justify-start px-0"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
                <span className="text-white/90">
                  Hi, {user?.username}
                </span>
              </>
            ) : (
              <Link to="/auth" className="w-full">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 w-full"
                >
                  <User size={18} className="mr-2" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
