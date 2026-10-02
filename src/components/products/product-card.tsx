import Image from "next/image";
import Link from "next/link";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";

interface ProductCardProps {
  product: ProductSummary;
  preload?: boolean;
}

export function ProductCard({ product, preload = false }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group border-border focus-visible:outline-primary flex h-full flex-col overflow-hidden rounded-lg border transition hover:shadow-md focus-visible:outline-2"
    >
      <div className="bg-surface relative aspect-square overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 240px, (min-width: 640px) 33vw, 50vw"
          preload={preload}
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {product.stock === 0 && (
          <span className="bg-foreground text-background absolute top-2 left-2 rounded px-2 py-0.5 text-xs font-medium">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-muted text-xs capitalize">{product.category}</p>
        <h2 className="line-clamp-2 text-sm font-medium">{product.title}</h2>
        <Rating value={product.rating} />
        <p className="mt-auto pt-2 font-semibold">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
