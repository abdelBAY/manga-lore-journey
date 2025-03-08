
import { Link } from "react-router-dom";
import { Heart, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as UserType } from "@/lib/types";
import { NavigateFunction } from "react-router-dom";

interface UserActionsProps {
  isAuthenticated: boolean;
  user: UserType | null;
  logout: () => Promise<void>;
  showAdminFeatures: boolean;
  navigate: NavigateFunction;
}

export default function UserActions({ 
  isAuthenticated, 
  user, 
  logout, 
  showAdminFeatures,
  navigate 
}: UserActionsProps) {
  if (isAuthenticated) {
    return (
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
    );
  }
  
  return (
    <Button onClick={() => navigate("/auth")}>Sign In</Button>
  );
}
