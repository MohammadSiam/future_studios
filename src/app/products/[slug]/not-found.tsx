import { PackageX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProductNotFound() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
      <EmptyState
        icon={PackageX}
        title="Product not found"
        description="The product you are looking for doesn't exist or is no longer available."
        action={
          <Link href="/products" className="text-sm font-medium underline">
            Browse all products
          </Link>
        }
      />
    </main>
  );
}
