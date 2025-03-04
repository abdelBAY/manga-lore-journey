
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://updcrfiknmfnpvzgdele.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZGNyZmlrbm1mbnB2emdkZWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTk1OTQsImV4cCI6MjA1NjY3NTU5NH0.wpaRmKBh8--ZjIr3jxNdHbqTqm8Ourg2LMBCwimHi0I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
