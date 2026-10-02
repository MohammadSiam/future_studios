import { Store } from "lucide-react";
import Link from "next/link";
import { CartBadge } from "@/components/cart/cart-badge";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-border bg-card/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Link
          href="/products"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <Store className="size-6" aria-hidden />
          {siteConfig.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-6">
          <CartBadge />
        </nav>
      </div>
    </header>
  );
}
