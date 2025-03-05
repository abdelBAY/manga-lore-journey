
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
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }
        
        // Get user favorites
        const { data: favorites, error: favoritesError } = await supabase
          .from('favorites')
          .select('manga_id')
          .eq('user_id', data.user.id);
        
        if (favoritesError) {
          console.error("Error fetching favorites:", favoritesError);
        }
        
        // Transform Supabase user to our User type
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          username: profile?.username || data.user.email?.split('@')[0] || 'User',
          favorites: favorites?.map(f => f.manga_id) || []
        };
        
        updateUserData(userData);
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        return userData;
      }
      
      return null;
    } catch (error: any) {
      console.error("Login failed:", error);
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
