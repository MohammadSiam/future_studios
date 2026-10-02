import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { buildProductsHref } from "@/lib/products-href";
import type { ProductQuery } from "@/lib/schemas/product-query";
import { cn } from "@/lib/utils";

interface PaginationProps {
  query: ProductQuery;
  totalPages: number;
}

const ITEM_CLASS =
  "flex h-9 min-w-9 items-center justify-center gap-1 rounded-md px-3 text-sm";

function getPageItems(current: number, total: number) {
  const pages = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1
      ? (["ellipsis", page] as const)
      : [page],
  );
}

export function Pagination({ query, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const { page } = query;
  const hrefFor = (target: number) =>
    buildProductsHref({ ...query, page: target });

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-1"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className={cn(ITEM_CLASS, "hover:bg-surface")}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </Link>
      ) : (
        <span className={cn(ITEM_CLASS, "text-muted")}>
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </span>
      )}

      {getPageItems(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className={cn(ITEM_CLASS, "text-muted")}
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              ITEM_CLASS,
              item === page
                ? "bg-primary text-primary-foreground"
                : "hover:bg-surface",
            )}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          className={cn(ITEM_CLASS, "hover:bg-surface")}
        >
          Next
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={cn(ITEM_CLASS, "text-muted")}>
          Next
          <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}
