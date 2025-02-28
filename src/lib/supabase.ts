
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkcuzagkcjwckeipedxh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrY3V6YWdrY2p3Y2tlaXBlZHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjEzMjUsImV4cCI6MjA1MzM5NzMyNX0.FHwC2LMmedHI_w7DcpgUtArmU8SmyXG8yLVuJBTm62A';

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
