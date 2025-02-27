
import Header from "@/components/Header";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
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
