
import { useState, useEffect } from "react";
import { User } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export function useAuthState(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    user,
    isLoading,
    isAuthenticated: !!user
  };
}
