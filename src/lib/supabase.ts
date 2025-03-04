
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
    const role = await fetchUserRole();
    console.log('User role:', role);
    return role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Helper function to set a user as admin (for use in the admin settings)
export const setUserAsAdmin = async (email: string): Promise<boolean> => {
  try {
    // First check if the user exists in auth
    const { data: userData, error: userError } = await supabase
      .from('auth')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (userError || !userData) {
      console.error('User not found:', email);
      return false;
    }
    
    // Check if user already has a role
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userData.id)
      .maybeSingle();
    
    if (existingRole) {
      // Update existing role
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', userData.id);
        
      return !error;
    } else {
      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.id,
          role: 'admin'
        });
        
      return !error;
    }
  } catch (error) {
    console.error('Error setting user as admin:', error);
    return false;
  }
};
