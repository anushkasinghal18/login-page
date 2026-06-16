import { GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import { cn } from "@/utils";

const ICONS = {
  student: GraduationCap,
  teacher: BookOpen,
  admin: ShieldCheck,
};

export default function RoleSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">I am a</span>
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: "student", label: "Student" },
          { value: "teacher", label: "Teacher" },
          { value: "admin", label: "Admin" },
        ].map(({ value: role, label }) => {
          const Icon = ICONS[role];
          const active = value === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onChange(role)}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20"
                  : "border-border bg-secondary/40 text-muted-foreground hover:border-border/80 hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
