import { useState, useCallback } from "react";
import { ROLE_DASHBOARD } from "@/constants";

const API_URL = "http://localhost:5000/api/auth";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const login = useCallback(async (values, role) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password, role }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        const res = { success: false, message: data.message || "Invalid email or password." };
        setResult(res);
        return res;
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      const res = {
        success: true,
        message: data.message || "Signed in successfully. Redirecting...",
        token: data.token,
        redirectTo: ROLE_DASHBOARD[role],
        user: data.user,
      };
      setResult(res);
      return res;
    } catch {
      const res = { success: false, message: "Server connection failed. Please check if backend is running." };
      setResult(res);
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (values, role) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        const res = { success: false, message: data.message || "Failed to create account." };
        setResult(res);
        return res;
      }
      const res = {
        success: true,
        message: data.message || "Account created successfully. You can now sign in.",
        redirectTo: ROLE_DASHBOARD[role],
      };
      setResult(res);
      return res;
    } catch {
      const res = { success: false, message: "Server connection failed. Please check if backend is running." };
      setResult(res);
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/logout`, { method: "POST" });
    } catch {}
    finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoading(false);
    }
    return { success: true, message: "Logged out successfully." };
  }, []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        return data.user;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      }
    } catch {
      const cached = localStorage.getItem("user");
      return cached ? JSON.parse(cached) : null;
    }
  }, []);

  return { login, signup, logout, loadUser, isLoading, result };
}
