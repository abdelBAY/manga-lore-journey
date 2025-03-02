import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, signInWithGoogle } = useAuth();

  // Get the intended destination from state, or default to home
  const from = location.state?.from || "/";

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(loginEmail, loginPassword);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerUsername || !registerEmail || !registerPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }
    
    if (registerPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(registerUsername, registerEmail, registerPassword);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-morphism p-8 rounded-xl animate-scale-in">
      <Tabs defaultValue="login" onValueChange={(v) => setActiveTab(v as "login" | "register")}>
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="login-password">Password</Label>
                <a
                  href="#"
                  className="text-xs text-white/70 hover:text-white transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-white/70">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              className="w-full bg-white text-black hover:bg-white/90 flex items-center justify-center"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Sign in with Google
            </Button>
            
            <p className="text-center text-sm text-white/70 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className="text-white underline hover:text-white/90 transition-colors"
              >
                Register
              </button>
            </p>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-username">Username</Label>
              <Input
                id="register-username"
                type="text"
                placeholder="username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="your@email.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-white/70">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              className="w-full bg-white text-black hover:bg-white/90 flex items-center justify-center"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Sign up with Google
            </Button>
            
            <p className="text-center text-sm text-white/70 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-white underline hover:text-white/90 transition-colors"
              >
                Login
              </button>
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
