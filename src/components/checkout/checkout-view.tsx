"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CartSkeleton } from "@/components/cart/cart-skeleton";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { calculateCartTotals } from "@/lib/cart";
import { useCartHydrated, useCartStore } from "@/store/cart";

export function CheckoutView() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totals = useMemo(() => calculateCartTotals(items), [items]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  function handleOrderPlaced(orderId: string) {
    setOrderPlaced(true);
    clearCart();
    router.replace(`/checkout/success?orderId=${orderId}`);
  }

  if (!hydrated) return <CartSkeleton />;
  if (orderPlaced)
    return <p role="status">Order placed! Redirecting to confirmation…</p>;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <CheckoutForm items={items} onOrderPlaced={handleOrderPlaced} />
      <CartSummary totals={totals} items={items} />
    </div>
  );
}
