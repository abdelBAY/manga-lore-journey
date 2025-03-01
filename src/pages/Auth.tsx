
import Header from "@/components/Header";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";
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
  }, [isAuthenticated, navigate, isLoading, from]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
