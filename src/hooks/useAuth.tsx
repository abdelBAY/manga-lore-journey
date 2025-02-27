
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect, createContext, useContext } from "react";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (username: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await api.login(email, password);
      setUser(loggedInUser);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      
      if (loggedInUser) {
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
      }
      
      return loggedInUser;
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      });
      return null;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const newUser = await api.register(username, email, password);
      setUser(newUser);
      
      if (newUser) {
        toast({
          title: "Success",
          description: "Registration successful",
        });
      }
      
      return newUser;
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Error",
        description: "Registration failed",
        variant: "destructive",
      });
      return null;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      navigate("/");
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Logout failed",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
