"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function GlobalError({ retry }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center p-4 font-sans">
        <title>Something went wrong</title>
        <EmptyState
          title="Something went wrong"
          description="An unexpected error occurred. Please try again."
          action={<Button onClick={retry}>Try again</Button>}
        />
      </body>
    </html>
  );
}
