import { cn } from "@/lib/cn";
import type { JobStatus } from "@/types";

interface BadgeProps {
  label: string;
  status?: JobStatus;
  className?: string;
}

const statusClasses: Record<JobStatus, string> = {
  "Under Review": "bg-surface-container-highest text-on-surface-variant",
  Interviewing: "bg-tertiary-container text-on-tertiary-container",
  Closed: "bg-surface-container-highest text-on-surface-variant",
  Active: "bg-tertiary-container text-on-tertiary-container",
};

export function Badge({ label, status, className }: BadgeProps) {
  const colorClass = status
    ? statusClasses[status]
    : "bg-surface-container-highest text-on-surface-variant";

  return (
    <span
      className={cn(
        "px-4 py-1.5 rounded-full text-xs font-semibold font-label",
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}
