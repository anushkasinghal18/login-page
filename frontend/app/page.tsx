import { AuthCard } from "@/components/auth/auth-card"
import { HeroPanel } from "@/components/auth/hero-panel"

export default function Page() {
  return (
    <main className="flex min-h-screen w-full bg-background">
      {/* Left panel - 45% (Authentication Form) */}
      <section className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-[45%] lg:px-14">
        <AuthCard />
      </section>

      {/* Right panel - 55% (Hero Section), hidden on small screens */}
      <section className="hidden lg:block lg:w-[55%]">
        <HeroPanel />
      </section>
    </main>
  )
}
