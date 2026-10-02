"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateCartTotals } from "@/lib/cart";
import { useCartHydrated, useCartStore } from "@/store/cart";

export function CartView() {
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = useMemo(() => calculateCartTotals(items), [items]);

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]" aria-busy="true">
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-56" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Looks like you haven't added anything yet."
        action={
          <Link href="/products" className="text-sm font-medium underline">
            Continue shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="divide-border border-border divide-y border-y">
        {items.map((item) => (
          <CartLineItem
            key={item.id}
            item={item}
            onQuantityChange={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </ul>
      <CartSummary totals={totals}>
        <Link
          href="/checkout"
          className="bg-primary text-primary-foreground flex h-11 w-full items-center justify-center rounded-md text-sm font-medium hover:opacity-90"
        >
          Proceed to checkout
        </Link>
      </CartSummary>
    </div>
  );
}
