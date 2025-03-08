
import HeaderComponent from "@/components/Header";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from state, or default to home
  const from = location.state?.from || "/";
  
  // Redirect to home or intended page if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Replace instead of push to avoid back-button issues
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);
  
  // Don't render anything during initial load to prevent flashing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If already authenticated, render nothing while redirecting
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <HeaderComponent />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-md mx-auto mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to MangaLore</h1>
          <p className="text-white/70">Sign in to track your favorite manga.</p>
        </div>
        
        <AuthForm />
      </main>
    </div>
  );
}
