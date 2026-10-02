"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useProductFilters } from "@/hooks/use-product-filters";

const SEARCH_DELAY_MS = 400;

export function SearchBar({ query = "" }: { query?: string }) {
  const { setFilters } = useProductFilters();
  const inputRef = useRef<HTMLInputElement>(null);
  const search = useDebouncedCallback(
    (value: string) => setFilters({ q: value.trim() }),
    SEARCH_DELAY_MS,
  );

  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement !== input) {
      input.value = query;
    }
  }, [query]);

  return (
    <div role="search" className="w-full sm:w-72">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <Input
        ref={inputRef}
        id="product-search"
        type="search"
        placeholder="Search products…"
        defaultValue={query}
        onChange={(event) => search(event.target.value)}
      />
    </div>
  );
}
