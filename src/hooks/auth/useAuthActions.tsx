
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { supabase } from "@/lib/supabase";

type AuthActions = {
  login: (email: string, password: string) => Promise<User | null>;
  register: (username: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  isActionLoading: boolean;
};

export function useAuthActions(updateUserData: (user: User) => void): AuthActions {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsActionLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        // Transform Supabase user to our User type
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'User',
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
        
        updateUserData(userData);
        
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
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<User | null> => {
    setIsActionLoading(true);
    
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
        
        updateUserData(userData);
        
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
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // User state will be cleared by the auth state listener
      
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

  return {
    login,
    register,
    logout,
    isActionLoading
  };
}
