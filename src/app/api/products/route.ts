import type { NextRequest } from "next/server";
import { getProducts } from "@/lib/api/products";
import { productQuerySchema } from "@/lib/schemas/product-query";

export async function GET(request: NextRequest) {
  const query = productQuerySchema.parse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  return Response.json(await getProducts(query));
}
