
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/auth/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  BookOpen,
  FileText,
  Settings,
  User,
  LogOut,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log("AdminLayout: Component mounted", { 
      isAuthenticated, 
      authLoading, 
      isAdmin, 
      adminLoading
    });
    
    // Only complete checks when all loading states are done
    if (!authLoading && !adminLoading) {
      console.log("AdminLayout: Auth checks complete", { isAuthenticated, isAdmin });
      setIsChecking(false);
      
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        console.log("AdminLayout: Not authenticated, redirecting to auth");
        toast({
          title: "Authentication Required",
          description: "Please log in to access the admin area.",
          variant: "destructive",
        });
        navigate("/auth", { state: { from: window.location.pathname } });
      }
    }
  }, [isAuthenticated, authLoading, isAdmin, adminLoading, navigate]);

  if (isChecking || authLoading || adminLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xl text-white/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-white/70 mb-6">You don't have permission to access this area.</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  const sidebarLinks = [
    { label: 'Dashboard', icon: <LayoutGrid size={18} />, href: '/admin' },
    { label: 'Manga', icon: <BookOpen size={18} />, href: '/admin/manga' },
    { label: 'Chapters', icon: <FileText size={18} />, href: '/admin/chapters' },
    { label: 'Settings', icon: <Settings size={18} />, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card/50 border-r border-border/50 hidden md:block">
        <div className="p-6 text-center">
          <h2 className="text-lg font-bold text-white">MangaLore Admin</h2>
          <p className="text-sm text-white/60">CMS Dashboard</p>
        </div>

        <div className="mt-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.label}
              className={cn(
                "flex items-center gap-3 px-6 py-3 w-full text-left transition",
                window.location.pathname === link.href
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-card/80 hover:text-primary"
              )}
              onClick={() => navigate(link.href)}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>

        <div className="absolute bottom-4 w-64 px-6">
          <div className="border-t border-border/50 pt-4 flex flex-col gap-2">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <User size={18} />
              <div className="overflow-hidden">
                <p className="truncate font-medium">{user?.username}</p>
                <p className="truncate text-xs text-white/60">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="justify-start text-destructive/80 hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar button */}
      <div className="md:hidden absolute top-4 left-4 z-30">
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => alert('Mobile sidebar not implemented')}>
          <LayoutGrid size={18} />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <Button variant="default" size="sm" onClick={() => navigate('/')}>
              Return to Site
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}
