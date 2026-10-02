"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartHydrated, useCartStore } from "@/store/cart";
import type { CartProduct } from "@/types/cart";

const FEEDBACK_DURATION_MS = 2000;

export function AddToCartButton({ product }: { product: CartProduct }) {
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

  return (
    <Button
      type="button"
      className="h-12 w-full sm:w-64"
      disabled={outOfStock || limitReached}
      onClick={() => {
        addItem(product);
        setAdded(true);
      }}
    >
      {outOfStock
        ? "Out of stock"
        : limitReached
          ? "Maximum quantity in cart"
          : added
            ? "Added to cart ✓"
            : "Add to cart"}
    </Button>
  );
}
