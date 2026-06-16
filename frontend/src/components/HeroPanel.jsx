import React from "react";

export default function HeroPanel() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background image */}
      <img
        src="/images/campus-hero.png"
        alt="Illustration of students learning on a smart campus platform"
        className="absolute inset-0 object-cover w-full h-full"
        style={{ objectFit: "cover" }}
      />
      {/* Light overlay for subtle contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.10))",
        }}
      />
    </div>
  );
}
