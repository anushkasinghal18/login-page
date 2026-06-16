import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/utils";

export default function ResultBanner({ result }) {
  const Icon = result.success ? CheckCircle2 : AlertCircle;
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm animate-auth-fade-in",
        result.success
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-destructive/30 bg-destructive/10 text-destructive"
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span className="text-pretty">{result.message}</span>
    </div>
  );
}
