"use client";

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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-muted flex-1 text-xs">
          Min
          <Input
            name="minPrice"
            type="number"
            min={0}
            defaultValue={minPrice}
            className="mt-1"
          />
        </label>
        <label className="text-muted flex-1 text-xs">
          Max
          <Input
            name="maxPrice"
            type="number"
            min={0}
            defaultValue={maxPrice}
            className="mt-1"
          />
        </label>
      </div>
      <Button type="submit" variant="outline" className="w-full">
        Apply
      </Button>
    </form>
  );
}
