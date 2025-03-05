
import { useState, useEffect } from "react";
import { User } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

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
        toast({
          title: "Authentication Error",
          description: "There was a problem checking your authentication status.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
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
      // Get user profile from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      }
      
      // Get user favorites
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('manga_id')
        .eq('user_id', session.user.id);
      
      if (favoritesError) {
        console.error("Error fetching favorites:", favoritesError);
      }
      
      // Transform Supabase user to our User type
      const userData: User = {
        id: session.user.id,
        email: session.user.email || '',
        username: profile?.username || session.user.email?.split('@')[0] || 'User',
        favorites: favorites?.map(f => f.manga_id) || []
      };
      
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
