import type { Metadata } from "next";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const { orderId } = await searchParams;

  if (typeof orderId !== "string") redirect("/products");

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p
        className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
        aria-hidden
      >
        <CircleCheckBig className="size-8" />
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">
        Thank you for your order!
      </h1>
      <p className="text-muted">
        Your order{" "}
        <span className="text-foreground font-semibold">#{orderId}</span> has
        been placed successfully. A confirmation email will be sent shortly.
      </p>
      <Link
        href="/products"
        className="bg-primary text-primary-foreground mt-4 inline-flex h-11 items-center rounded-md px-6 text-sm font-medium hover:opacity-90"
      >
        Continue shopping
      </Link>
    </main>
  );
}
