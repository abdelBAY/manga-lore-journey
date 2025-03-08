
import React, { useState } from "react";
import { setUserAsAdmin } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import HeaderComponent from "@/components/HeaderComponent";

export default function GiveAccess() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGrantAdmin = async () => {
    setLoading(true);
    try {
      const success = await setUserAsAdmin("abdelbay1997@gmail.com");
      
      if (success) {
        setResult("Success! Admin access granted to abdelbay1997@gmail.com");
        toast({
          title: "Admin Access Granted",
          description: "The user has been given admin privileges.",
        });
      } else {
        setResult("Failed to grant admin access. User might not exist.");
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
            <p className="mb-4 text-white/70">
              Click the button below to grant admin access to: <strong>abdelbay1997@gmail.com</strong>
            </p>
            
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
