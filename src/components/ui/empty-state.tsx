import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-16 text-center">
      <span className="bg-surface text-muted mb-2 flex size-14 items-center justify-center rounded-full">
        <Icon className="size-7" aria-hidden />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-muted max-w-sm text-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
