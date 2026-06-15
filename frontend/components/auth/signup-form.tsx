"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Mail, Phone, Lock, Loader2 } from "lucide-react"
import { Field } from "./field"
import { SocialButtons } from "./social-buttons"
import { ResultBanner } from "./result-banner"
import { signupSchema, type SignupValues } from "@/lib/auth/schemas"
import { useAuth } from "@/lib/auth/use-auth"
import { ROLES, type Role } from "@/lib/auth/types"
import { useRouter } from "next/navigation"

export function SignupForm({ role }: { role: Role }) {
  const { signup, isLoading, result } = useAuth()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  })

  const roleLabel = ROLES.find((r) => r.value === role)?.label

  async function onSubmit(values: SignupValues) {
    const res = await signup(values, role)
    if (res && res.success && res.redirectTo) {
      setTimeout(() => {
        router.push(res.redirectTo)
      }, 1500)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {result && <ResultBanner result={result} />}

      <p className="rounded-lg border border-border bg-secondary/40 px-3.5 py-2 text-xs text-muted-foreground">
        Creating a <span className="font-semibold text-primary">{roleLabel}</span> account
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="First Name"
          icon={User}
          placeholder="Jane"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Field
          label="Last Name"
          icon={User}
          placeholder="Doe"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

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
        label="Mobile Number"
        icon={Phone}
        type="tel"
        placeholder="+1 555 000 0000"
        autoComplete="tel"
        error={errors.mobile?.message}
        {...register("mobile")}
      />

      <Field
        label="Password"
        icon={Lock}
        isPassword
        placeholder="Min 8 chars, 1 uppercase, 1 number"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Field
        label="Confirm Password"
        icon={Lock}
        isPassword
        placeholder="Re-enter your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mt-1 flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      <Divider />
      <SocialButtons role={role} />
    </form>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">or sign up with</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
