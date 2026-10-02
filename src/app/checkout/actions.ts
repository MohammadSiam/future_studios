"use server";

import { getProductBySlug } from "@/lib/api/products";
import { orderSchema, type OrderInput } from "@/lib/schemas/checkout";

type PlaceOrderResult =
  { success: true; orderId: string } | { success: false; error: string };

export async function placeOrder(input: OrderInput): Promise<PlaceOrderResult> {
  const parsed = orderSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check your order details and try again.",
    };
  }

  for (const { slug, quantity } of parsed.data.items) {
    const product = await getProductBySlug(slug);

    if (!product) {
      return {
        success: false,
        error: "Some products in your cart are no longer available.",
      };
    }

    if (quantity > product.stock) {
      return {
        success: false,
        error: `Only ${product.stock} of "${product.title}" left in stock.`,
      };
    }
  }

  return {
    success: true,
    orderId: crypto.randomUUID().slice(0, 8).toUpperCase(),
  };
}
