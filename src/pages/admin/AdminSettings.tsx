
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { checkIsAdmin, supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const AdminSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await checkIsAdmin();
      setIsAdmin(admin);
      if (!admin) {
        navigate("/");
      }
    };

    checkAdmin();
  }, [navigate]);

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
      // Get current user's email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to perform this action");
      }
      
      // Find the user by email
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError || !userData) {
        throw new Error("User not found with that email");
      }
      
      // Insert or update the user role
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userData.id,
          role: 'admin'
        }, { onConflict: 'user_id' });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `Admin role granted to ${email}.`,
      });
      
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

  if (isAdmin === null) {
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
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
