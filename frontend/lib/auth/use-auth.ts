"use client"

import { useState, useCallback } from "react"
import type { AuthResult, Role, User } from "./types"
import { ROLE_DASHBOARD } from "./types"
import type { LoginValues, SignupValues } from "./schemas"

const API_URL = "http://localhost:5000/api/auth"

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AuthResult | null>(null)

  const login = useCallback(async (values: LoginValues, role: Role): Promise<AuthResult> => {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          role,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        const res = { success: false, message: data.message || "Invalid email or password." }
        setResult(res)
        return res
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      const res = {
        success: true,
        message: data.message || "Signed in successfully. Redirecting to your dashboard...",
        token: data.token,
        redirectTo: ROLE_DASHBOARD[role],
        user: data.user,
      }
      setResult(res)
      
      // Auto-reload/redirect is handled by the component, but returning it is useful
      return res
    } catch {
      const res = { success: false, message: "Server connection failed. Please check if backend is running." }
      setResult(res)
      return res
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (values: SignupValues, role: Role): Promise<AuthResult> => {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          mobile: values.mobile,
          password: values.password,
          confirmPassword: values.confirmPassword,
          role,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        const res = { success: false, message: data.message || "Failed to create account." }
        setResult(res)
        return res
      }

      const res = {
        success: true,
        message: data.message || "Account created successfully. You can now sign in.",
        redirectTo: ROLE_DASHBOARD[role],
      }
      setResult(res)
      return res
    } catch {
      const res = { success: false, message: "Server connection failed. Please check if backend is running." }
      setResult(res)
      return res
    } finally {
      setIsLoading(false)
    }
  }, [])

  const googleLogin = useCallback(async (credential: string, role: Role): Promise<AuthResult> => {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await fetch(`${API_URL}/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential, role }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        const res = { success: false, message: data.message || "Google login failed." }
        setResult(res)
        return res
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      const userRole = data.user.role || role
      const res = {
        success: true,
        message: data.message || "Google login successful.",
        token: data.token,
        redirectTo: ROLE_DASHBOARD[userRole],
        user: data.user,
      }
      setResult(res)
      return res
    } catch {
      const res = { success: false, message: "Server connection failed. Please check if backend is running." }
      setResult(res)
      return res
    } finally {
      setIsLoading(false)
    }
  }, [])

  const microsoftLogin = useCallback(async (accessToken: string, role: Role): Promise<AuthResult> => {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await fetch(`${API_URL}/microsoft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken, role }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        const res = { success: false, message: data.message || "Microsoft login failed." }
        setResult(res)
        return res
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      const userRole = data.user.role || role
      const res = {
        success: true,
        message: data.message || "Microsoft login successful.",
        token: data.token,
        redirectTo: ROLE_DASHBOARD[userRole],
        user: data.user,
      }
      setResult(res)
      return res
    } catch {
      const res = { success: false, message: "Server connection failed. Please check if backend is running." }
      setResult(res)
      return res
    } finally {
      setIsLoading(false)
    }
  }, [])

  const appleLogin = useCallback(async (identityToken: string, role: Role, userDetails?: any): Promise<AuthResult> => {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await fetch(`${API_URL}/apple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identityToken, role, userDetails }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        const res = { success: false, message: data.message || "Apple login failed." }
        setResult(res)
        return res
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      const userRole = data.user.role || role
      const res = {
        success: true,
        message: data.message || "Apple login successful.",
        token: data.token,
        redirectTo: ROLE_DASHBOARD[userRole],
        user: data.user,
      }
      setResult(res)
      return res
    } catch {
      const res = { success: false, message: "Server connection failed. Please check if backend is running." }
      setResult(res)
      return res
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async (): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      await fetch(`${API_URL}/logout`, { method: "POST" })
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsLoading(false)
    }
    return { success: true, message: "Logged out successfully." }
  }, [])

  const loadUser = useCallback(async (): Promise<User | null> => {
    const token = localStorage.getItem("token")
    if (!token) return null

    try {
      const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok && data.success) {
        localStorage.setItem("user", JSON.stringify(data.user))
        return data.user
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        return null
      }
    } catch {
      // Offline fallback: use cached user details if present
      const cached = localStorage.getItem("user")
      return cached ? JSON.parse(cached) : null
    }
  }, [])

  const reset = useCallback(() => setResult(null), [])

  return { login, signup, googleLogin, microsoftLogin, appleLogin, logout, loadUser, isLoading, result, reset }
}
