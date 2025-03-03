
import { createContext, useContext, ReactNode, useState } from "react";
import { User } from "@/lib/types";
import { useAuthState } from "./useAuthState";
import { useAuthActions } from "./useAuthActions";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (username: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  isActionLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [localUser, setLocalUser] = useState<User | null>(null);
  const { user, isLoading, isAuthenticated } = useAuthState();
  const { login, register, logout, isActionLoading } = useAuthActions(
    (userData: User) => setLocalUser(userData)
  );
  
  // Combine state from hooks
  const currentUser = localUser || user;

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isLoading,
        isAuthenticated: isAuthenticated || !!currentUser,
        login,
        register,
        logout,
        isActionLoading
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
