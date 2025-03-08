
import { Link } from "react-router-dom";
import { Menu, X, Search, ShieldCheck } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User as UserType } from "@/lib/types";

interface NavLinkProps {
  path: string;
  label: string;
}

interface MobileNavProps {
  handleSearch: (e: React.FormEvent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navLinks: NavLinkProps[];
  isActiveLink: (path: string) => boolean;
  isAuthenticated: boolean;
  user: UserType | null;
  logout: () => Promise<void>;
  showAdminFeatures: boolean;
  navigate: NavigateFunction;
}

export default function MobileNav({
  handleSearch,
  searchQuery,
  setSearchQuery,
  navLinks,
  isActiveLink,
  isAuthenticated,
  user,
  logout,
  showAdminFeatures,
  navigate
}: MobileNavProps) {
  return (
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
  );
}
