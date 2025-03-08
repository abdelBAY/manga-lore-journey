
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import UserActions from "./UserActions";
import { useAuth } from "@/hooks/auth/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";

export default function HeaderComponent() {
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
        <Logo />
        
        <DesktopNav 
          navLinks={navLinks} 
          isActiveLink={isActiveLink} 
        />
        
        <div className="hidden md:flex items-center space-x-4">
          <SearchForm 
            handleSearch={handleSearch} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          
          <UserActions 
            isAuthenticated={isAuthenticated} 
            user={user} 
            logout={logout} 
            showAdminFeatures={showAdminFeatures}
            navigate={navigate}
          />
        </div>

        <MobileNav 
          handleSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          navLinks={navLinks}
          isActiveLink={isActiveLink}
          isAuthenticated={isAuthenticated}
          user={user}
          logout={logout}
          showAdminFeatures={showAdminFeatures}
          navigate={navigate}
        />
      </div>
    </header>
  );
}
