"use client"

import { forwardRef, useState } from "react"
import { Eye, EyeOff, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: string
  isPassword?: boolean
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, icon: Icon, error, isPassword, type = "text", className, id, ...props },
  ref,
) {
  const [show, setShow] = useState(false)
  const inputId = id ?? props.name
  const inputType = isPassword ? (show ? "text" : "password") : type

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          aria-invalid={!!error}
          className={cn(
            "w-full rounded-lg border border-border bg-secondary/60 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70",
            "transition-all duration-200 outline-none",
            "focus:border-primary/60 focus:bg-secondary focus:ring-4 focus:ring-primary/15",
            Icon ? "pl-9" : "pl-3.5",
            isPassword ? "pr-10" : "pr-3.5",
            error && "border-destructive/70 focus:border-destructive focus:ring-destructive/15",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
})
