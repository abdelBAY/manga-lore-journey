
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://updcrfiknmfnpvzgdele.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZGNyZmlrbm1mbnB2emdkZWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTk1OTQsImV4cCI6MjA1NjY3NTU5NH0.wpaRmKBh8--ZjIr3jxNdHbqTqm8Ourg2LMBCwimHi0I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchUserRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
    
    return data?.role || 'user';
  } catch (error) {
    console.error('Error in fetchUserRole:', error);
    return 'user';
  }
};

export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    // Get the session token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('No session found');
      return false;
    }
    
    // Call the check-admin edge function with the auth token
    const { data, error } = await supabase.functions.invoke('check-admin', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Helper function to set a user as admin
export const setUserAsAdmin = async (email: string): Promise<boolean> => {
  if (!email || !email.includes('@')) {
    console.error('Invalid email provided:', email);
    return false;
  }

  try {
    // Get the session token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No session found, user must be logged in');
      return false;
    }
    
    console.log(`Attempting to grant admin access to: ${email}`);
    
    // Call the set-admin edge function with the auth token
    const { data, error } = await supabase.functions.invoke('set-admin', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      },
      body: { email }
    });
    
    if (error) {
      console.error('Error setting user as admin:', error);
      return false;
    }
    
    console.log('Set admin response:', data);
    return data?.success || false;
  } catch (error) {
    console.error('Error setting user as admin:', error);
    return false;
  }
};
