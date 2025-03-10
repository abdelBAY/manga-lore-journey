
import React, { useState } from "react";
import { setUserAsAdmin } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HeaderComponent from "@/components/HeaderComponent";

export default function GiveAccess() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [email, setEmail] = useState("abdelbay1997@gmail.com");

  const handleGrantAdmin = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const success = await setUserAsAdmin(email);
      
      if (success) {
        setResult(`Success! Admin access granted to ${email}`);
        toast({
          title: "Admin Access Granted",
          description: `The user ${email} has been given admin privileges.`,
        });
      } else {
        setResult(`Failed to grant admin access to ${email}. User might not exist.`);
        toast({
          title: "Error",
          description: "Failed to grant admin access. The user might not exist.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error granting admin access:", error);
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      toast({
        title: "Error",
        description: "There was a problem granting admin access.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderComponent />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Grant Admin Access</h1>
          
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="mb-4 space-y-2">
              <label htmlFor="email" className="block text-white/70">Email Address</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={handleGrantAdmin} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Processing..." : "Grant Admin Access"}
            </Button>
            
            {result && (
              <div className={`mt-4 p-3 rounded ${result.includes("Success") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                {result}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
