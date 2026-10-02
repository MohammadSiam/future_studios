import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "border-border bg-card focus-visible:outline-primary h-10 rounded-md border px-3 text-sm focus-visible:outline-2",
        className,
      )}
      {...props}
    />
  );
}
