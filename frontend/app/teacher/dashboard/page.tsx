"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/use-auth"
import type { User } from "@/lib/auth/types"
import { Loader2, LogOut, Users, FileText, CheckSquare, Calendar, Shield, CheckCircle } from "lucide-react"

export default function TeacherDashboard() {
  const { loadUser, logout } = useAuth()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await loadUser()
      if (!currentUser) {
        router.push("/")
      } else if (currentUser.role !== "teacher") {
        router.push(`/${currentUser.role}/dashboard`)
      } else {
        setUser(currentUser)
        setLoading(false)
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
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-md shadow-orange-500/20">T</span>
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
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/45 to-orange-950/35 p-6 sm:p-8 border border-orange-855/20 shadow-2xl mb-8">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Faculty Portal</p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">Welcome back, Dr. {user?.firstName}!</h1>
              <p className="mt-1 text-sm text-zinc-300">Here is your workspace to manage classes, grades, and resources.</p>
            </div>
            <div className="flex items-center gap-3 bg-zinc-900/60 rounded-xl px-4 py-2 border border-zinc-800">
              <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-xs">
                <p className="font-semibold text-zinc-200">Session Mode</p>
                <p className="text-zinc-400">Faculty Console</p>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 -mr-16 -mt-16 size-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        </section>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur">
            <div className="flex flex-col items-center text-center">
              <div className="size-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-amber-500/10 mb-4">
                {user?.firstName.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <h2 className="text-lg font-bold">Dr. {user?.firstName} {user?.lastName}</h2>
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

          {/* Academic Stats & Timetable */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
                <div className="flex items-center justify-between text-zinc-400">
                  <Users className="size-5 text-amber-400" />
                  <span className="text-xs font-medium">Total Students</span>
                </div>
                <p className="mt-2 text-2xl font-bold">124</p>
                <span className="text-xs text-zinc-400">Across 4 classes</span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
                <div className="flex items-center justify-between text-zinc-400">
                  <Calendar className="size-5 text-orange-400" />
                  <span className="text-xs font-medium">Teaching Hours</span>
                </div>
                <p className="mt-2 text-2xl font-bold">16 hrs</p>
                <span className="text-xs text-zinc-400">Weekly average</span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
                <div className="flex items-center justify-between text-zinc-400">
                  <CheckSquare className="size-5 text-yellow-400" />
                  <span className="text-xs font-medium">Pending Grades</span>
                </div>
                <p className="mt-2 text-2xl font-bold">14</p>
                <span className="text-xs text-rose-400 font-medium">Due in 2 days</span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
                <div className="flex items-center justify-between text-zinc-400">
                  <FileText className="size-5 text-emerald-400" />
                  <span className="text-xs font-medium">Course Files</span>
                </div>
                <p className="mt-2 text-2xl font-bold">42</p>
                <span className="text-xs text-emerald-400">Sync status: OK</span>
              </div>
            </div>

            {/* Courses Overview */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4">
                <Users className="size-4 text-amber-400" />
                Active Class Sections
              </h3>
              <div className="divide-y divide-zinc-800/80">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-semibold text-sm">Advanced Software Engineering (L-1)</h4>
                    <p className="text-xs text-zinc-400">38 Students | Lecture Hall A</p>
                  </div>
                  <span className="rounded bg-amber-950/50 border border-amber-800/50 px-2 py-0.5 text-xs text-amber-400 font-mono">10:00 - 11:30 AM</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-semibold text-sm">Database Management Systems (Lab)</h4>
                    <p className="text-xs text-zinc-400">28 Students | Computer Lab 3</p>
                  </div>
                  <span className="rounded bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-400 font-mono">12:00 - 01:30 PM</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-semibold text-sm">Systems Architectures (L-2)</h4>
                    <p className="text-xs text-zinc-400">58 Students | Auditorium 2</p>
                  </div>
                  <span className="rounded bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-400 font-mono">04:30 - 06:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
