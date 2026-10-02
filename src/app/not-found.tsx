import { FileQuestionMark } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
      <EmptyState
        icon={FileQuestionMark}
        title="Page not found"
        description="The page you are looking for doesn't exist or has been moved."
        action={
          <Link href="/products" className="text-sm font-medium underline">
            Browse products
          </Link>
        }
      />
    </main>
  );
}
