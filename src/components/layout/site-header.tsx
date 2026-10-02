import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-border bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Link href="/products" className="text-lg font-bold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav aria-label="Main">
          <Link
            href="/products"
            className="text-sm font-medium hover:underline"
          >
            Products
          </Link>
        </nav>
      </div>
    </header>
  );
}
