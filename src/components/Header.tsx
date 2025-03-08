
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Heart, User, BookOpen, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/auth/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdminFeatures, setShowAdminFeatures] = useState(false);
  
  // Effect to update admin features visibility
  useEffect(() => {
    if (isAuthenticated && isAdmin && !isAdminLoading) {
      setShowAdminFeatures(true);
    } else {
      setShowAdminFeatures(false);
    }
  }, [isAuthenticated, isAdmin, isAdminLoading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/search", label: "Browse" },
    ...(isAuthenticated ? [{ path: "/favorites", label: "Favorites" }] : []),
  ];

  const isActiveLink = (path: string) => 
    (path === "/" && location.pathname === "/") || 
    (path !== "/" && location.pathname.startsWith(path));

  if (!isAuthenticated && location.pathname !== "/auth" && 
      !location.pathname.startsWith("/manga") && 
      location.pathname !== "/" && 
      location.pathname !== "/search") {
    navigate("/auth");
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          <span>MangaLore</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActiveLink(link.path)
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
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

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/favorites">
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              
              {showAdminFeatures && (
                <Link to="/admin">
                  <Button variant="default" size="sm" className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Button>
                </Link>
              )}
              
              <div className="group relative">
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                  <User className="h-5 w-5" />
                </Button>
                
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-card w-48 rounded-md shadow-lg py-2 border border-border">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="font-medium text-sm truncate">{user?.username}</p>
                      <p className="text-xs text-white/60 truncate">{user?.email}</p>
                    </div>
                    {showAdminFeatures && (
                      <Link to="/admin" className="block w-full px-4 py-2 text-left text-sm hover:bg-white/5 text-white/80 hover:text-white">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => logout()}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 text-white/80 hover:text-white"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-white" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-80">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-bold">Menu</div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </SheetClose>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    type="search"
                    placeholder="Search manga..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              <nav className="space-y-2 flex-1">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.path}>
                    <Link
                      to={link.path}
                      className={`block py-2 px-3 rounded-md text-sm ${
                        isActiveLink(link.path)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                
                {showAdminFeatures && (
                  <SheetClose asChild>
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 py-2 px-3 rounded-md text-sm bg-primary/10 text-primary"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </SheetClose>
                )}
              </nav>

              <div className="border-t border-white/10 mt-auto pt-4">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="px-3 py-2">
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-sm text-white/60">{user?.email}</p>
                    </div>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => logout()}
                      >
                        Sign Out
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  <SheetClose asChild>
                    <Button
                      onClick={() => navigate("/auth")}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                  </SheetClose>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
