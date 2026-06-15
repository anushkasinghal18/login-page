"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/use-auth"
import type { User } from "@/lib/auth/types"
import { Loader2, LogOut, Shield, Database, Activity, UserCheck, AlertTriangle, CheckCircle } from "lucide-react"

export default function AdminDashboard() {
  const { loadUser, logout } = useAuth()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [dbStatus, setDbStatus] = useState<any>(null)

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await loadUser()
      if (!currentUser) {
        router.push("/")
      } else if (currentUser.role !== "admin") {
        router.push(`/${currentUser.role}/dashboard`)
      } else {
        setUser(currentUser)
        setLoading(false)
        fetchDbStatus()
      }
    }

    async function fetchDbStatus() {
      try {
        const response = await fetch("http://localhost:5000/api/health")
        if (response.ok) {
          const data = await response.json()
          setDbStatus(data)
        }
      } catch (err) {
        console.error("Health check error", err)
      }
    }

    checkAuth()
  }, [loadUser, router])

  async function handleLogout() {
    await logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="mt-4 text-sm text-zinc-400">Verifying session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center font-bold text-white shadow-md shadow-red-500/20">A</span>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">ERP-LMS Portal</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm font-medium hover:bg-zinc-800 hover:text-white transition"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/40 to-rose-950/30 p-6 sm:p-8 border border-red-900/20 shadow-2xl mb-8">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">Administration Portal</p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">System Admin Console</h1>
              <p className="mt-1 text-sm text-zinc-300">You are logged in as {user?.firstName} {user?.lastName}. System operations are active.</p>
            </div>
            <div className="flex items-center gap-3 bg-zinc-900/60 rounded-xl px-4 py-2 border border-zinc-800">
              <Shield className="size-4 text-rose-500" />
              <div className="text-xs">
                <p className="font-semibold text-zinc-200">Security Clearance</p>
                <p className="text-rose-400">Level: Superadmin</p>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 -mr-16 -mt-16 size-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        </section>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur">
            <div className="flex flex-col items-center text-center">
              <div className="size-20 rounded-full bg-gradient-to-tr from-rose-500 to-red-500 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-rose-500/10 mb-4">
                {user?.firstName.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <h2 className="text-lg font-bold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-xs text-zinc-400 capitalize bg-zinc-800 px-2.5 py-0.5 rounded-full mt-1.5 border border-zinc-700/50">{user?.role}</p>
            </div>

            <div className="mt-6 space-y-4 border-t border-zinc-800/60 pt-6 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Email Address</span>
                <span className="font-medium text-zinc-200">{user?.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Mobile Number</span>
                <span className="font-medium text-zinc-200">{user?.mobile || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Account Status</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle className="size-3.5" /> Active
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Verified</span>
                <span className="text-zinc-200 font-medium">{user?.isVerified ? "Yes" : "No"}</span>
              </div>
              <div className="flex flex-col gap-1 py-1 border-t border-zinc-800/40 mt-2 pt-3">
                <span className="text-xs text-zinc-400">Last Login:</span>
                <span className="text-xs font-mono text-zinc-300">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "First login session"}</span>
              </div>
            </div>
          </div>

          {/* System Control & Monitoring */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
                <div className="flex items-center justify-between text-zinc-400">
                  <Activity className="size-5 text-rose-500" />
                  <span className="text-xs font-medium">Server Status</span>
                </div>
                <p className="mt-2 text-2xl font-bold">ONLINE</p>
                <span className="text-xs text-emerald-400 font-medium">API responsive</span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
                <div className="flex items-center justify-between text-zinc-400">
                  <Database className="size-5 text-indigo-400" />
                  <span className="text-xs font-medium">Active Store</span>
                </div>
                <p className="mt-2 text-md font-bold truncate max-w-full">
                  {dbStatus ? dbStatus.database.replace(" Store (In-Memory)", "") : "CHECKING..."}
                </p>
                <span className="text-xs text-zinc-400">Auto-failover enabled</span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
                <div className="flex items-center justify-between text-zinc-400">
                  <UserCheck className="size-5 text-cyan-400" />
                  <span className="text-xs font-medium">Active Users</span>
                </div>
                <p className="mt-2 text-2xl font-bold">85</p>
                <span className="text-xs text-zinc-400">Across campus app</span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
                <div className="flex items-center justify-between text-zinc-400">
                  <AlertTriangle className="size-5 text-amber-500" />
                  <span className="text-xs font-medium">Alerts</span>
                </div>
                <p className="mt-2 text-2xl font-bold">0</p>
                <span className="text-xs text-emerald-400 font-medium">All services normal</span>
              </div>
            </div>

            {/* Database & Mock logs status */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4">
                <Database className="size-4 text-rose-500" />
                Integration Log Summary
              </h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs font-mono text-zinc-400 space-y-2">
                  <p className="text-zinc-500">// System logs trace</p>
                  <p><span className="text-rose-400">[SYSTEM]</span> Auth Controller: Initialized Social Verification services.</p>
                  <p><span className="text-rose-400">[SYSTEM]</span> Config: Connection to DB checked. Status: {dbStatus ? dbStatus.database : "Pending"}.</p>
                  <p><span className="text-emerald-400">[OK]</span> Server: Loaded environment variables from .env.</p>
                  <p><span className="text-cyan-400">[INFO]</span> UserService: Initialized defaults (student@test.com, teacher@test.com, admin@test.com).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
