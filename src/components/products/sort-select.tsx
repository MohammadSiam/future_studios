"use client";

import { Select } from "@/components/ui/select";
import { useProductFilters } from "@/hooks/use-product-filters";
import type { SortOption } from "@/lib/schemas/product-query";

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "rating-desc": "Top Rated",
  "name-asc": "Name: A to Z",
};

export function SortSelect({ sort }: { sort: SortOption }) {
  const { setFilters } = useProductFilters();

  return (
    <label className="flex shrink-0 items-center gap-2 text-sm">
      <span className="text-muted">Sort by</span>
      <Select
        defaultValue={sort}
        onChange={(event) => setFilters({ sort: event.target.value })}
      >
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </label>
  );
}
