"use client"

import { useState, useCallback } from "react"
import type { AuthResult, Role } from "./types"
import { ROLE_DASHBOARD } from "./types"
import type { LoginValues, SignupValues } from "./schemas"

/**
 * Frontend-only auth hooks.
 *
 * These simulate the POST /api/auth/login and POST /api/auth/signup endpoints
 * described in the spec, including the documented response-handling branches.
 * Swap the body of `request` with a real Axios call when wiring a backend, e.g.
 *
 *   const { data } = await axios.post("/api/auth/login", payload)
 */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fakeLogin(values: LoginValues, role: Role): Promise<AuthResult> {
  await delay(1100)
  const email = values.email.toLowerCase().trim()

  // Demo branches that exercise every documented response state.
  if (email === "disabled@erp.edu") {
    return { success: false, message: "Your account has been disabled. Contact your administrator." }
  }
  if (email === "unverified@erp.edu") {
    return { success: false, message: "Account not verified. Please check your email to verify." }
  }
  if (values.password === "wrongpass") {
    return { success: false, message: "Invalid email or password." }
  }

  return {
    success: true,
    message: "Signed in successfully. Redirecting to your dashboard...",
    token: "demo.jwt.token",
    redirectTo: ROLE_DASHBOARD[role],
    user: {
      firstName: "Demo",
      lastName: role.charAt(0).toUpperCase() + role.slice(1),
      email,
      mobile: "",
      role,
      isActive: true,
      isVerified: true,
      profileImage: "",
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
}

async function fakeSignup(values: SignupValues, role: Role): Promise<AuthResult> {
  await delay(1300)
  const email = values.email.toLowerCase().trim()

  if (email === "exists@erp.edu") {
    return { success: false, message: "An account with this email already exists." }
  }
  if (values.mobile.replace(/\D/g, "") === "0000000000") {
    return { success: false, message: "This mobile number is already registered." }
  }

  return {
    success: true,
    message: "Account created successfully. You can now sign in.",
    redirectTo: ROLE_DASHBOARD[role],
  }
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AuthResult | null>(null)

  const login = useCallback(async (values: LoginValues, role: Role) => {
    setIsLoading(true)
    setResult(null)
    try {
      const res = await fakeLogin(values, role)
      setResult(res)
      return res
    } catch {
      const res: AuthResult = { success: false, message: "Something went wrong. Please try again." }
      setResult(res)
      return res
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (values: SignupValues, role: Role) => {
    setIsLoading(true)
    setResult(null)
    try {
      const res = await fakeSignup(values, role)
      setResult(res)
      return res
    } catch {
      const res: AuthResult = { success: false, message: "Something went wrong. Please try again." }
      setResult(res)
      return res
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => setResult(null), [])

  return { login, signup, isLoading, result, reset }
}
