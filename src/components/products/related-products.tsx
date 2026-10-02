import { ProductGrid } from "@/components/products/product-grid";
import { getRelatedProducts } from "@/lib/api/products";
import type { Product } from "@/types/product";

export async function RelatedProducts({ product }: { product: Product }) {
  const related = await getRelatedProducts(product);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-4 text-xl font-semibold">
        Related products
      </h2>
      <ProductGrid products={related} />
    </section>
  );
}
