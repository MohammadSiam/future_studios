import { z } from "zod";

export const PAGE_SIZE = 24;

export const SORT_OPTIONS = [
  "relevance",
  "price-asc",
  "price-desc",
  "rating-desc",
  "name-asc",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

const optionalPrice = z.coerce
  .number()
  .nonnegative()
  .optional()
  .catch(undefined);

export const productQuerySchema = z.object({
  q: z.string().trim().max(100).optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  minPrice: optionalPrice,
  maxPrice: optionalPrice,
  rating: z.coerce.number().int().min(1).max(5).optional().catch(undefined),
  sort: z.enum(SORT_OPTIONS).default("relevance").catch("relevance"),
  page: z.coerce.number().int().min(1).default(1).catch(1),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
