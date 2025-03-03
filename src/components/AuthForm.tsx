
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleSwitchToRegister = () => {
    setActiveTab("register");
  };

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="w-full max-w-md mx-auto glass-morphism p-8 rounded-xl animate-scale-in">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "login" | "register")}
      >
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
