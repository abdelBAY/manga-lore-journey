
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { checkIsAdmin, setUserAdmin } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

const AdminSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      console.log("Checking admin status...");
      setCheckingAdmin(true);
      
      try {
        if (!user) {
          console.log("No user logged in");
          setIsAdmin(false);
          navigate("/auth", { state: { from: "/admin/settings" } });
          return;
        }

        console.log("User is logged in, checking admin status for:", user.email);
        const admin = await checkIsAdmin();
        console.log("Admin check result:", admin);
        
        setIsAdmin(admin);
        
        if (!admin) {
          console.log("User is not an admin, granting admin to first user");
          // For the first user of the system, automatically make them an admin
          const success = await setUserAdmin(user.email);
          if (success) {
            console.log("Successfully granted admin to first user");
            setIsAdmin(true);
            toast({
              title: "Admin Access Granted",
              description: "You have been granted admin access as the first user.",
            });
          } else {
            console.log("Admin grant failed, redirecting to home");
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [navigate, user, toast]);

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

  if (checkingAdmin) {
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
