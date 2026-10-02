"use client";

import { ArrowRight } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductFilters } from "@/hooks/use-product-filters";

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
}

export function PriceFilter({ minPrice, maxPrice }: PriceFilterProps) {
  const { setFilters } = useProductFilters();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFilters({
      minPrice: formData.get("minPrice")?.toString(),
      maxPrice: formData.get("maxPrice")?.toString(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        name="minPrice"
        type="number"
        min={0}
        placeholder="Min"
        aria-label="Minimum price"
        defaultValue={minPrice}
        className="h-9 min-w-0 px-2"
      />
      <Input
        name="maxPrice"
        type="number"
        min={0}
        placeholder="Max"
        aria-label="Maximum price"
        defaultValue={maxPrice}
        className="h-9 min-w-0 px-2"
      />
      <Button
        type="submit"
        variant="outline"
        className="size-9 shrink-0 p-0"
        aria-label="Apply price filter"
        title="Apply"
      >
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </form>
  );
}
