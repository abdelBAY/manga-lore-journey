import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "@/lib/auth-schemas";
import { useAuth } from "@/hooks/auth/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser } = useAuth();
  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    
    try {
      await registerUser(data.username, data.email, data.password);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Registration error:", error);
      // Toast is handled in the register function
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-username">Username</Label>
        <Input
          id="register-username"
          type="text"
          placeholder="username"
          {...register("username")}
          disabled={isSubmitting}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
        />
        {errors.username && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.username.message}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
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
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
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
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          disabled={isSubmitting}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full bg-white text-black hover:bg-white/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Register"}
      </Button>
      
      <p className="text-center text-sm text-white/70 mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-white underline hover:text-white/90 transition-colors"
        >
          Login
        </button>
      </p>
    </form>
  );
}
