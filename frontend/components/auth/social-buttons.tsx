"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/use-auth"
import type { Role } from "@/lib/auth/types"

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 23 23" className="size-4" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#f25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
      <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
      <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
    </svg>
  )
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-foreground" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

const PROVIDERS = [
  { id: "microsoft", name: "Microsoft", Logo: MicrosoftLogo },
  { id: "google", name: "Google", Logo: GoogleLogo },
  { id: "apple", name: "Apple", Logo: AppleLogo },
]

interface SocialButtonsProps {
  role: Role
}

export function SocialButtons({ role }: SocialButtonsProps) {
  const { googleLogin, microsoftLogin, appleLogin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      // Validate the message origin is our frontend
      if (event.origin !== window.location.origin) return

      const { type, data } = event.data
      if (!type || !type.startsWith("OAUTH_SUCCESS_")) return

      const provider = type.replace("OAUTH_SUCCESS_", "").toLowerCase()

      try {
        let res
        if (provider === "google") {
          res = await googleLogin(data.token, role)
        } else if (provider === "microsoft") {
          res = await microsoftLogin(data.token, role)
        } else if (provider === "apple") {
          res = await appleLogin(data.token, role, {
            name: {
              firstName: data.name.split(" ")[0],
              lastName: data.name.split(" ").slice(1).join(" ") || "",
            },
          })
        }

        if (res && res.success && res.redirectTo) {
          router.push(res.redirectTo)
        }
      } catch (err) {
        console.error("Failed to complete social login routing", err)
      }
    }

    window.addEventListener("message", handleOAuthMessage)
    return () => window.removeEventListener("message", handleOAuthMessage)
  }, [role, googleLogin, microsoftLogin, appleLogin, router])

  const handleSocialClick = (providerId: string) => {
    // Open a popup containing our simulated OAuth dashboard
    const width = 500
    const height = 620
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    window.open(
      `/auth/simulated?provider=${providerId}&role=${role}`,
      `oauth_popup_${providerId}`,
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {PROVIDERS.map(({ id, name, Logo }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleSocialClick(id)}
          className="group relative flex w-full items-center rounded-lg border border-border bg-secondary/60 px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-border/80 hover:bg-secondary hover:shadow-lg hover:shadow-black/30"
        >
          <span className="absolute left-4 flex items-center">
            <Logo />
          </span>
          <span className="w-full text-center">Continue with {name}</span>
        </button>
      ))}
    </div>
  )
}
