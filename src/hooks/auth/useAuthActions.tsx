
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
      // Start auth request
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        // Create optimistic user right away for immediate UI feedback
        const optimisticUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          username: data.user.email?.split('@')[0] || 'User',
          favorites: []
        };
        
        // Update UI immediately
        updateUserData(optimisticUser);

        // Optimistically cache to localStorage for faster loads
        localStorage.setItem('cached_user', JSON.stringify(optimisticUser));
        
        // In background, fetch complete profile data
        Promise.all([
          supabase.from('profiles').select('*').eq('id', data.user.id).single(),
          supabase.from('favorites').select('manga_id').eq('user_id', data.user.id)
        ]).then(([profileResult, favoritesResult]) => {
          if (!profileResult.error && !favoritesResult.error) {
            const completeUser: User = {
              id: data.user.id,
              email: data.user.email || '',
              username: profileResult.data?.username || data.user.email?.split('@')[0] || 'User',
              favorites: favoritesResult.data?.map(f => f.manga_id) || []
            };
            
            // Update with complete data
            updateUserData(completeUser);
            localStorage.setItem('cached_user', JSON.stringify(completeUser));
          }
        }).catch(err => {
          console.error("Error loading complete profile:", err);
        });
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        return optimisticUser;
      }
      
      return null;
    } catch (error: any) {
      console.error("Login failed:", error);
      // Clear any optimistic data
      localStorage.removeItem('cached_user');
      
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsActionLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<User | null> => {
    setIsActionLoading(true);
    
    try {
      // Check if username is already taken
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username);
      
      if (checkError) {
        console.error("Error checking username:", checkError);
      }
      
      if (existingProfiles && existingProfiles.length > 0) {
        toast({
          title: "Registration Failed",
          description: "Username is already taken. Please choose another one.",
          variant: "destructive",
        });
        return null;
      }
      
      // Register the user
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
          username: username,
          favorites: []
        };
        
        updateUserData(userData);
        
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully!",
        });
        
        return userData;
      }
      
      return null;
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create your account",
        variant: "destructive",
      });
      return null;
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
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout Failed",
        description: error.message || "Could not log you out",
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
