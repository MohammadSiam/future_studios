import Link from "next/link";
import type { ReactNode } from "react";
import { PriceFilter } from "@/components/products/price-filter";
import { buildProductsHref } from "@/lib/products-href";
import type { ProductQuery } from "@/lib/schemas/product-query";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  query: ProductQuery;
  categories: string[];
}

const RATING_OPTIONS = [4, 3, 2, 1];
const RATING_CHIP_CLASS =
  "border-border rounded-full border px-2.5 text-xs leading-6";

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function FilterLink({
  href,
  active,
  className,
  children,
}: {
  href: string;
  active: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "hover:bg-surface block truncate rounded-md px-2 py-0.5 text-sm capitalize",
        active && "bg-surface font-medium",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function FilterSidebar({ query, categories }: FilterSidebarProps) {
  const { q, category, minPrice, maxPrice, rating } = query;
  const hasFilters =
    Boolean(q || category || rating) ||
    minPrice !== undefined ||
    maxPrice !== undefined;
  const hrefWith = (updates: Partial<ProductQuery>) =>
    buildProductsHref({ ...query, ...updates, page: 1 });

  return (
    <aside
      className="border-border bg-card space-y-5 rounded-lg border p-4"
      aria-label="Filters"
    >
      <FilterSection title="Category">
        <ul className="space-y-0.5">
          <li>
            <FilterLink
              href={hrefWith({ category: undefined })}
              active={!category}
            >
              All categories
            </FilterLink>
          </li>
          {categories.map((item) => (
            <li key={item}>
              <FilterLink
                href={hrefWith({ category: item })}
                active={category === item}
              >
                {item}
              </FilterLink>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Price">
        <PriceFilter
          key={`${minPrice}-${maxPrice}`}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </FilterSection>

      <FilterSection title="Rating">
        <ul className="flex flex-wrap gap-1.5">
          <li>
            <FilterLink
              href={hrefWith({ rating: undefined })}
              active={!rating}
              className={RATING_CHIP_CLASS}
            >
              Any
            </FilterLink>
          </li>
          {RATING_OPTIONS.map((value) => (
            <li key={value}>
              <FilterLink
                href={hrefWith({ rating: value })}
                active={rating === value}
                className={RATING_CHIP_CLASS}
              >
                <span aria-hidden>{value}★+</span>
                <span className="sr-only">{value} stars &amp; up</span>
              </FilterLink>
            </li>
          ))}
        </ul>
      </FilterSection>

      {hasFilters && (
        <Link href="/products" className="block text-sm font-medium underline">
          Clear all filters
        </Link>
      )}
    </aside>
  );
}
