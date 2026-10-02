import type { ReactNode } from "react";
import { FREE_SHIPPING_THRESHOLD, type calculateCartTotals } from "@/lib/cart";
import { formatPrice, pluralize } from "@/lib/utils";

interface CartSummaryProps {
  totals: ReturnType<typeof calculateCartTotals>;
  children?: ReactNode;
}

export function CartSummary({ totals, children }: CartSummaryProps) {
  const { itemCount, subtotal, shipping, total } = totals;

  return (
    <section
      aria-labelledby="summary-heading"
      className="border-border space-y-4 rounded-lg border p-6"
    >
      <h2 id="summary-heading" className="text-lg font-semibold">
        Order summary
      </h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">
            Subtotal ({pluralize(itemCount, "item")})
          </dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="border-border flex justify-between border-t pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {shipping > 0 && (
        <p className="text-muted text-xs">
          Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free
          shipping.
        </p>
      )}
      {children}
    </section>
  );
}
