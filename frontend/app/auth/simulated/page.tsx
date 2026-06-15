"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Shield, Loader2 } from "lucide-react"

export default function SimulatedAuthPopup() {
  const searchParams = useSearchParams()
  const provider = searchParams.get("provider") || "google"
  const role = searchParams.get("role") || "student"

  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const providerNames: Record<string, string> = {
    google: "Google",
    microsoft: "Microsoft Entra ID",
    apple: "Apple",
  }

  const providerColors: Record<string, string> = {
    google: "from-amber-500 to-red-500 shadow-red-500/10",
    microsoft: "from-blue-500 to-cyan-500 shadow-blue-500/10",
    apple: "from-zinc-700 to-zinc-900 shadow-zinc-500/10",
  }

  const mockUsers = [
    { email: "student@test.com", name: "Demo Student", role: "student" },
    { email: "teacher@test.com", name: "Demo Teacher", role: "teacher" },
    { email: "admin@test.com", name: "Demo Admin", role: "admin" },
  ]

  // Find users that match the selected role (prioritize them)
  const filteredUsers = mockUsers.sort((a, b) => {
    if (a.role === role && b.role !== role) return -1
    if (a.role !== role && b.role === role) return 1
    return 0
  })

  const handleSelectUser = (email: string) => {
    setLoading(true)
    setSelectedUser(email)

    // Generate a dummy JWT token payload to pass back
    const payload = {
      email,
      name: email === "student@test.com" ? "Demo Student" : email === "teacher@test.com" ? "Demo Teacher" : "Demo Admin",
      role: email === "student@test.com" ? "student" : email === "teacher@test.com" ? "teacher" : "admin",
      provider,
      token: `simulated_${provider}_token_for_${email.split("@")[0]}`
    }

    setTimeout(() => {
      if (window.opener) {
        // Post message back to parent window
        window.opener.postMessage(
          {
            type: `OAUTH_SUCCESS_${provider.toUpperCase()}`,
            data: payload,
          },
          window.location.origin
        )
        window.close()
      } else {
        alert("Opener window not found. Please log in directly.")
        setLoading(false)
      }
    }, 1200)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center">
          <div className={`size-12 rounded-xl bg-gradient-to-tr ${providerColors[provider]} flex items-center justify-center text-white text-lg font-bold shadow-lg mb-4 capitalize`}>
            {provider.charAt(0)}
          </div>
          <h1 className="text-xl font-bold tracking-tight">Simulated {providerNames[provider]} Sign-In</h1>
          <p className="mt-1.5 text-xs text-zinc-400">
            This popup simulates the OAuth account authorization flow.
          </p>
        </div>

        {loading ? (
          <div className="my-10 flex flex-col items-center justify-center">
            <Loader2 className="size-8 animate-spin text-cyan-500" />
            <p className="mt-3 text-xs text-zinc-400">Authorizing access with {providerNames[provider]}...</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Choose an account to continue</p>
            
            {filteredUsers.map((u) => (
              <button
                key={u.email}
                onClick={() => handleSelectUser(u.email)}
                className="w-full text-left rounded-xl border border-zinc-850 bg-zinc-900/60 p-3 hover:bg-zinc-800/80 transition flex items-center justify-between group"
              >
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">{u.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{u.email}</p>
                </div>
                <span className={`text-[10px] capitalize px-2 py-0.5 rounded-full border ${
                  u.role === role 
                    ? "bg-cyan-950/40 border-cyan-800/80 text-cyan-400" 
                    : "bg-zinc-850 border-zinc-700 text-zinc-400"
                }`}>
                  {u.role}
                </span>
              </button>
            ))}

            <div className="border-t border-zinc-850 pt-4 mt-2">
              <button
                onClick={() => window.close()}
                className="w-full rounded-lg bg-zinc-800 py-2 text-center text-xs font-semibold hover:bg-zinc-750 transition"
              >
                Cancel Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
