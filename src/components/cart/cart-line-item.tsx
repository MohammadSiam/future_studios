import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { QuantityControl } from "@/components/cart/quantity-control";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface CartLineItemProps {
  item: CartItem;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartLineItem = memo(function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  return (
    <li className="flex gap-4 p-4 sm:p-6">
      <Link
        href={`/products/${item.slug}`}
        className="bg-surface relative size-24 shrink-0 overflow-hidden rounded-md"
      >
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Link
            href={`/products/${item.slug}`}
            className="font-medium hover:underline"
          >
            {item.title}
          </Link>
          <p className="text-muted text-sm">{formatPrice(item.price)} each</p>
        </div>
        <div className="flex items-center gap-4">
          <QuantityControl
            quantity={item.quantity}
            max={item.stock}
            onChange={(quantity) => onQuantityChange(item.id, quantity)}
            label={`Quantity for ${item.title}`}
          />
          <p className="w-24 text-right font-semibold">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-muted hover:text-foreground flex items-center gap-1 self-start text-sm hover:underline"
        >
          <Trash2 className="size-4" aria-hidden />
          Remove
        </button>
      </div>
    </li>
  );
});
