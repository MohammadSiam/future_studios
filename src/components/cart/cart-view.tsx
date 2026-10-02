"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSkeleton } from "@/components/cart/cart-skeleton";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { calculateCartTotals } from "@/lib/cart";
import { useCartHydrated, useCartStore } from "@/store/cart";

export function CartView() {
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = useMemo(() => calculateCartTotals(items), [items]);

  if (!hydrated) return <CartSkeleton />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="divide-border border-border bg-card divide-y rounded-lg border">
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
          className="bg-primary text-primary-foreground flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-medium hover:opacity-90"
        >
          Proceed to checkout
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </CartSummary>
    </div>
  );
}
