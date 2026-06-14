"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { RoleSelector } from "./role-selector"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import type { Role } from "@/lib/auth/types"

type Tab = "login" | "signup"

export function AuthCard() {
  const [tab, setTab] = useState<Tab>("login")
  const [role, setRole] = useState<Role>("student")

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      {/* Tab switcher */}
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-secondary/50 p-1">
        {(["login", "signup"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg py-2 text-sm font-medium transition-all duration-200",
              tab === t
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "login" ? "Login" : "Create Account"}
          </button>
        ))}
      </div>

      <RoleSelector value={role} onChange={setRole} />

      {/* Forms keyed so they re-mount and replay the fade-in animation */}
      <div key={tab} className="animate-auth-fade-in">
        {tab === "login" ? <LoginForm role={role} /> : <SignupForm role={role} />}
      </div>
    </div>
  )
}
