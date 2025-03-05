
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setUserAsAdmin, supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useAdmin";
import { UserCheck } from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentAdmins, setRecentAdmins] = useState<{email: string, timestamp: string}[]>([]);
  const { isAdmin, isLoading } = useIsAdmin();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }

    // Set up realtime subscription for user_roles table
    const channel = supabase
      .channel('admin_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_roles'
        },
        (payload) => {
          console.log('New admin added:', payload);
          
          // Check if the payload contains relevant data
          if (payload.new && payload.new.role === 'admin') {
            // Fetch the user email for the newly added admin
            const fetchNewAdminInfo = async () => {
              try {
                const { data, error } = await supabase
                  .from('user_roles')
                  .select('user_id')
                  .eq('id', payload.new.id)
                  .single();
                
                if (error || !data) return;
                
                // Get user details from auth
                const { data: userData } = await supabase.auth.admin.getUserById(data.user_id);
                
                if (userData && userData.user) {
                  setRecentAdmins(prev => [
                    { email: userData.user.email || 'Unknown', timestamp: new Date().toISOString() },
                    ...prev.slice(0, 4) // Keep only the 5 most recent
                  ]);
                }
              } catch (err) {
                console.error('Error fetching new admin info:', err);
              }
            };
            
            fetchNewAdminInfo();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, isLoading, navigate]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await setUserAsAdmin(email);
      
      if (!success) {
        throw new Error("Failed to add admin. The user might not exist.");
      }
      
      toast({
        title: "Success",
        description: `Admin role granted to ${email}.`,
      });
      
      // Add to recent admins list (will be updated by realtime subscription as well)
      setRecentAdmins(prev => [
        { email, timestamp: new Date().toISOString() },
        ...prev.slice(0, 4)
      ]);
      
      setEmail("");
    } catch (error: any) {
      console.error("Error adding admin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <AdminLayout title="Admin Settings">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Grant admin privileges to other users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">User Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? "Processing..." : "Grant Admin"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The user must already have an account in the system.
                  </p>
                </div>
              </form>
              
              {recentAdmins.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Recently Added Admins</h3>
                  <div className="border rounded-md divide-y">
                    {recentAdmins.map((admin, i) => (
                      <div key={i} className="flex items-center gap-2 p-2">
                        <UserCheck size={16} className="text-green-500" />
                        <span className="flex-1 font-medium">{admin.email}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(admin.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
