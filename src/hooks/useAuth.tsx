
import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (username: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session check
    const checkUser = async () => {
      setIsLoading(true);
      
      try {
        // Get session data
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await updateUserData(session);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await updateUserData(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    checkUser();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper to update user data when authentication state changes
  const updateUserData = async (session: Session) => {
    if (!session?.user) return null;
    
    try {
      // Transform Supabase user to our User type
      const userData: User = {
        id: session.user.id,
        email: session.user.email || '',
        username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
        favorites: []
      };
      
      // Check if there are any favorites
      const { data: favorites } = await supabase
        .from('favorites')
        .select('manga_id')
        .eq('user_id', userData.id);
      
      if (favorites && favorites.length > 0) {
        userData.favorites = favorites.map(f => f.manga_id);
      }
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error updating user data:", error);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'User',
          favorites: []
        };
        
        // Fetch favorites if any
        const { data: favorites } = await supabase
          .from('favorites')
          .select('manga_id')
          .eq('user_id', userData.id);
        
        if (favorites && favorites.length > 0) {
          userData.favorites = favorites.map(f => f.manga_id);
        }
        
        setUser(userData);
        
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        
        return userData;
      }
      
      return null;
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
      return null;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          username: username || data.user.email?.split('@')[0] || 'User',
          favorites: []
        };
        
        setUser(userData);
        
        toast({
          title: "Success",
          description: "Registration successful! Please verify your email if required.",
        });
        
        return userData;
      }
      
      return null;
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
      return null;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      navigate("/");
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: error.message || "Logout failed",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
