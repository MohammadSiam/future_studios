"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { pluralize } from "@/lib/utils";
import { useCartHydrated, useCartStore } from "@/store/cart";

export function CartBadge() {
  const hydrated = useCartHydrated();
  const count = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const visibleCount = hydrated ? count : 0;

  return (
    <Link
      href="/cart"
      className="hover:bg-surface relative flex size-10 items-center justify-center rounded-full"
      aria-label={`Cart, ${pluralize(visibleCount, "item")}`}
    >
      <ShoppingCart className="size-5" aria-hidden />
      {visibleCount > 0 && (
        <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full px-1 text-xs">
          {visibleCount}
        </span>
      )}
    </Link>
  );
}
