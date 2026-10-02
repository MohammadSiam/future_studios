import { ProductCard } from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductSummary } from "@/types/product";

const GRID_CLASS = "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4";
interface ProductGridProps {
  products: ProductSummary[];
  preloadCount?: number;
}

export function ProductGrid({ products, preloadCount = 0 }: ProductGridProps) {
  return (
    <ul className={GRID_CLASS}>
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} preload={index < preloadCount} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <Skeleton className="mb-4 h-5 w-48" />
      <div className={GRID_CLASS}>
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="border-border overflow-hidden rounded-lg border"
          >
            <Skeleton className="aspect-square rounded-none" />
            <div className="space-y-2 p-3">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
