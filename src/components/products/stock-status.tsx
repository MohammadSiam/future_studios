import { cn } from "@/lib/utils";

const LOW_STOCK_THRESHOLD = 5;

export function StockStatus({ stock }: { stock: number }) {
  const label =
    stock === 0
      ? "Out of stock"
      : stock <= LOW_STOCK_THRESHOLD
        ? `Only ${stock} left in stock`
        : `In stock (${stock} available)`;

  return (
    <p
      className={cn(
        "text-sm font-medium",
        stock === 0
          ? "text-red-600"
          : stock <= LOW_STOCK_THRESHOLD
            ? "text-amber-600"
            : "text-green-600",
      )}
    >
      {label}
    </p>
  );
}
