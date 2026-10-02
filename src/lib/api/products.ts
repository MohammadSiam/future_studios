import "server-only";
import { cache } from "react";
import data from "@/lib/data/products.json";
import {
  PAGE_SIZE,
  type ProductQuery,
  type SortOption,
} from "@/lib/schemas/product-query";
import type {
  PaginatedResponse,
  Product,
  ProductSummary,
} from "@/types/product";

const products: Product[] = data;
const productsBySlug = new Map(
  products.map((product) => [product.slug, product]),
);
const categories = [
  ...new Set(products.map((product) => product.category)),
].sort();

const comparators: Record<
  SortOption,
  ((a: Product, b: Product) => number) | null
> = {
  relevance: null,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "rating-desc": (a, b) => b.rating - a.rating,
  "name-asc": (a, b) => a.title.localeCompare(b.title),
};

function toSummary(product: Product): ProductSummary {
  const { id, slug, title, brand, category, price, rating, stock, thumbnail } =
    product;
  return { id, slug, title, brand, category, price, rating, stock, thumbnail };
}

function matchesQuery(product: Product, query: ProductQuery) {
  const { q, category, minPrice, maxPrice, rating } = query;
  const term = q?.toLowerCase();

  return (
    (!term ||
      product.title.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term)) &&
    (!category || product.category === category) &&
    (minPrice === undefined || product.price >= minPrice) &&
    (maxPrice === undefined || product.price <= maxPrice) &&
    (rating === undefined || product.rating >= rating)
  );
}

export async function getProducts(
  query: ProductQuery,
): Promise<PaginatedResponse<ProductSummary>> {
  const filtered = products.filter((product) => matchesQuery(product, query));
  const comparator = comparators[query.sort];
  const sorted = comparator ? filtered.toSorted(comparator) : filtered;

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, totalPages);
  const start = (page - 1) * PAGE_SIZE;

  return {
    items: sorted.slice(start, start + PAGE_SIZE).map(toSummary),
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    return productsBySlug.get(slug) ?? null;
  },
);

export async function getRelatedProducts(
  product: Product,
  limit = 8,
): Promise<ProductSummary[]> {
  return products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .toSorted((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map(toSummary);
}

export async function getCategories(): Promise<string[]> {
  return categories;
}

export async function getAllSlugs(): Promise<string[]> {
  return products.map((product) => product.slug);
}
