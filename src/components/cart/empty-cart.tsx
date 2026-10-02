import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export function EmptyCart() {
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
