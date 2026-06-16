import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Field } from "./Field";
import ResultBanner from "./ResultBanner";
import { loginSchema } from "../../lib/auth/schemas";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";


export default function LoginForm({ role }) {
  const { login, isLoading, result } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSubmit(values) {
    const res = await login(values, role);
    if (res && res.success && res.redirectTo) {
      setTimeout(() => {
        navigate(res.redirectTo);
      }, 1200);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {result && <ResultBanner result={result} />}

      <Field
        label="Email Address"
        icon={Mail}
        type="email"
        placeholder="you@university.edu"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Field
        label="Password"
        icon={Lock}
        isPassword
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border-border bg-secondary text-primary accent-primary"
            {...register("rememberMe")}
          />
          Remember me
        </label>
        <button type="button" className="text-sm font-medium text-primary transition-opacity hover:opacity-80">
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-1 flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
