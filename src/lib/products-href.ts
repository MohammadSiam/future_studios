import type { ProductQuery } from "@/lib/schemas/product-query";

const DEFAULTS: Partial<ProductQuery> = { sort: "relevance", page: 1 };

export function buildProductsHref(query: Partial<ProductQuery>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (
      value !== undefined &&
      value !== "" &&
      DEFAULTS[key as keyof ProductQuery] !== value
    ) {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `/products?${queryString}` : "/products";
}
