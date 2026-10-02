"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface ErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ProductsError({ retry }: ErrorProps) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
      <EmptyState
        title="Something went wrong"
        description="We couldn't load the products. Please try again."
        action={<Button onClick={retry}>Try again</Button>}
      />
    </main>
  );
}
