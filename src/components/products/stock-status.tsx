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
          ? "text-red-700 dark:text-red-400"
          : stock <= LOW_STOCK_THRESHOLD
            ? "text-amber-700 dark:text-amber-400"
            : "text-green-700 dark:text-green-400",
      )}
    >
      {label}
    </p>
  );
}
