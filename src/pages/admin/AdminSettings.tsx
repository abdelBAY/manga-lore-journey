
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setUserAdmin } from "@/lib/supabase";
import { useAuth } from "@/hooks/auth/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";

const AdminSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin, isLoading, isFirstUser } = useIsAdmin();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
      const success = await setUserAdmin(email);
      
      if (!success) {
        throw new Error("User not found or operation failed");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Checking admin privileges...</div>
      </div>
    );
  }

  return (
    <AdminLayout title="Admin Settings">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
        
        {isFirstUser && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-md p-4 mb-6">
            <p className="text-green-500 font-medium">
              You have been automatically granted admin privileges as the first user.
            </p>
          </div>
        )}
        
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
