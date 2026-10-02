"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FilterDrawer({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const [open, setOpen] = useState(false);
  const [prevQueryString, setPrevQueryString] = useState(queryString);

  if (queryString !== prevQueryString) {
    setPrevQueryString(queryString);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const { overflow } = document.body.style;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full lg:hidden"
        aria-expanded={open}
        aria-controls="product-filters"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="size-4" aria-hidden />
        Filters
      </Button>

      <div
        id="product-filters"
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-label={open ? "Filters" : undefined}
        className={cn(
          "lg:sticky lg:top-20 lg:block",
          open
            ? "bg-background fixed inset-0 z-20 overflow-y-auto p-4"
            : "hidden",
        )}
      >
        {open && (
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              autoFocus
            >
              <X className="size-4" aria-hidden />
              Close
            </Button>
          </div>
        )}
        {children}
      </div>
    </>
  );
}
