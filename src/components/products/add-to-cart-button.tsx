"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartHydrated, useCartStore } from "@/store/cart";
import type { CartProduct } from "@/types/cart";

const FEEDBACK_DURATION_MS = 2000;

interface AddToCartButtonProps {
  product: CartProduct;
  variant?: "full" | "icon";
  className?: string;
}

export function AddToCartButton({
  product,
  variant = "full",
  className,
}: AddToCartButtonProps) {
  const hydrated = useCartHydrated();
  const addItem = useCartStore((state) => state.addItem);
  const quantityInCart = useCartStore(
    (state) =>
      state.items.find((item) => item.id === product.id)?.quantity ?? 0,
  );
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timeout = setTimeout(() => setAdded(false), FEEDBACK_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [added]);

  const outOfStock = product.stock === 0;
  const limitReached = hydrated && quantityInCart >= product.stock;
  const label = outOfStock
    ? "Out of stock"
    : limitReached
      ? "Maximum quantity in cart"
      : added
        ? "Added to cart"
        : "Add to cart";
  const Icon = added ? Check : ShoppingCart;

  return (
    <Button
      type="button"
      className={cn(
        variant === "icon" ? "size-10 rounded-full p-0" : "h-12 w-full sm:w-64",
        className,
      )}
      disabled={outOfStock || limitReached}
      aria-label={variant === "icon" ? `${label}: ${product.title}` : undefined}
      title={variant === "icon" ? label : undefined}
      onClick={() => {
        addItem(product);
        setAdded(true);
      }}
    >
      <Icon className="size-5" aria-hidden />
      {variant === "full" && label}
    </Button>
  );
}
