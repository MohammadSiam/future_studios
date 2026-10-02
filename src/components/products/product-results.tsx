import Link from "next/link";
import { Pagination } from "@/components/products/pagination";
import { ProductGrid } from "@/components/products/product-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { getProducts } from "@/lib/api/products";
import type { ProductQuery } from "@/lib/schemas/product-query";

export async function ProductResults({ query }: { query: ProductQuery }) {
  const { items, total, page, pageSize, totalPages } = await getProducts(query);

  if (items.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try a different search term or adjust your filters."
        action={
          <Link href="/products" className="text-sm font-medium underline">
            Clear all filters
          </Link>
        }
      />
    );
  }

  const start = (page - 1) * pageSize + 1;

  return (
    <section aria-label="Product results">
      <p className="text-muted mb-4 text-sm">
        Showing {start}–{start + items.length - 1} of {total} products
      </p>
      <ProductGrid products={items} preloadCount={4} />
      <Pagination query={{ ...query, page }} totalPages={totalPages} />
    </section>
  );
}
