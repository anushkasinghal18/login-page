import Image from "next/image"

export function HeroPanel() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src="/images/campus-hero.png"
        alt="Illustration of students learning on a smart campus platform"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay gradient per spec */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.45))",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
    </div>
  )
}
