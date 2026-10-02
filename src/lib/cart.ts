import type { CartItem } from "@/types/cart";

export const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 9.99;

export function calculateCartTotals(items: CartItem[]) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return { itemCount, subtotal, shipping, total: subtotal + shipping };
}
