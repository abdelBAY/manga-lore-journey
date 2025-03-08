
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/lib/auth-schemas";
import { useAuth } from "@/hooks/auth/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const result = await login(data.email, data.password);
      if (result) {
        // Immediate navigation to improve perceived performance
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Toast is handled in the login function
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="your@email.com"
          {...register("email")}
          disabled={isSubmitting}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
        />
        {errors.email && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.email.message}
          </p>
        )}
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
          {...register("password")}
          disabled={isSubmitting}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
        />
        {errors.password && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.password.message}
          </p>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full bg-white text-black hover:bg-white/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
      
      <p className="text-center text-sm text-white/70 mt-4">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-white underline hover:text-white/90 transition-colors"
        >
          Register
        </button>
      </p>
    </form>
  );
}
