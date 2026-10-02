import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Shopping cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Shopping cart
      </h1>
      <CartView />
    </main>
  );
}
