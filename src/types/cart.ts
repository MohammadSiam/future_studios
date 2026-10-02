import type { ProductSummary } from "@/types/product";

export type CartProduct = Pick<
  ProductSummary,
  "id" | "slug" | "title" | "price" | "stock" | "thumbnail"
>;

export type CartItem = CartProduct & { quantity: number };
