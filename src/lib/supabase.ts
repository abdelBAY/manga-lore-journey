
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { api } from './api';
import { Manga, Chapter } from './types';

// Use the same credentials as in src/integrations/supabase/client.ts
const supabaseUrl = 'https://dxbvkqshqgfzugzadnjq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4YnZrcXNocWdmenVnemFkbmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjkwMDAsImV4cCI6MjA1OTQ0NTAwMH0.6u_2Zc5EBX1zRbZow33lWecKBynT-4oGKvPCSAKRlDc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

export const fetchUserRole = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
  
  if (error || !data) return 'user';
  return data.role;
};

export const checkIsAdmin = async (): Promise<boolean> => {
  const role = await fetchUserRole();
  return role === 'admin';
};

// Function to set a user as admin (can only be used by admins)
export const setUserAdmin = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('set_user_admin', { email });
    
    if (error) throw error;
    
    return !!data;
  } catch (error: any) {
    console.error('Error setting user as admin:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to set user as admin',
      variant: 'destructive',
    });
    return false;
  }
};
