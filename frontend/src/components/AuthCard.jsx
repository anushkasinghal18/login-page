import { useState } from "react";
import { cn } from "@/utils";
import RoleSelector from "./RoleSelector";
import LoginForm from "./LoginForm";
import { SignupForm } from "./SignupForm";

// No TypeScript types – plain JS component
export function AuthCard() {
  const [tab, setTab] = useState("login"); // "login" or "signup"
  const [role, setRole] = useState("student");

  return (
        <div className="flex w-full max-w-md flex-col gap-6">
      {/* Tab switcher */}
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-secondary/50 p-1">
        {(["login", "signup"]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg py-2 text-sm font-medium transition-all duration-200",
              tab === t
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "login" ? "Login" : "Create Account"}
          </button>
        ))}
      </div>

      <RoleSelector value={role} onChange={setRole} />

      {/* Forms keyed so they re‑mount and replay the fade‑in animation */}
      <div key={tab} className="animate-auth-fade-in">
        {tab === "login" ? <LoginForm role={role} /> : <SignupForm role={role} />}
      </div>
    </div>
  );
}
