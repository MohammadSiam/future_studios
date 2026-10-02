import type { NextRequest } from "next/server";
import { getProductBySlug } from "@/lib/api/products";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/products/[slug]">,
) {
  const { slug } = await ctx.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
}
