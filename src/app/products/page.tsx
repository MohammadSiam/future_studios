import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterSidebar } from "@/components/products/filter-sidebar";
import { ProductGridSkeleton } from "@/components/products/product-grid";
import { ProductResults } from "@/components/products/product-results";
import { SearchBar } from "@/components/products/search-bar";
import { SortSelect } from "@/components/products/sort-select";
import { getCategories } from "@/lib/api/products";
import { productQuerySchema } from "@/lib/schemas/product-query";

export async function generateMetadata({
  searchParams,
}: PageProps<"/products">): Promise<Metadata> {
  const { q } = productQuerySchema.parse(await searchParams);
  return { title: q ? `Search results for "${q}"` : "All products" };
}

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const [query, categories] = await Promise.all([
    searchParams.then((params) => productQuerySchema.parse(params)),
    getCategories(),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar query={query.q} />
          <SortSelect key={query.sort} sort={query.sort} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <FilterSidebar query={query} categories={categories} />
        <Suspense
          key={JSON.stringify(query)}
          fallback={<ProductGridSkeleton />}
        >
          <ProductResults query={query} />
        </Suspense>
      </div>
    </main>
  );
}
