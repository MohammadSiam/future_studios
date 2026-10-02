"use client";

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
      className="relative text-sm font-medium hover:underline"
      aria-label={`Cart, ${pluralize(visibleCount, "item")}`}
    >
      Cart
      {visibleCount > 0 && (
        <span className="bg-primary text-primary-foreground absolute -top-2 -right-4 flex min-w-5 items-center justify-center rounded-full px-1 text-xs">
          {visibleCount}
        </span>
      )}
    </Link>
  );
}
