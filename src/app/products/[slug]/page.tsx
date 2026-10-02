import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductGridSkeleton } from "@/components/products/product-grid";
import { RelatedProducts } from "@/components/products/related-products";
import { ReviewList } from "@/components/products/review-list";
import { StockStatus } from "@/components/products/stock-status";
import { Rating } from "@/components/ui/rating";
import { getAllSlugs, getProductBySlug } from "@/lib/api/products";
import { buildProductsHref } from "@/lib/products-href";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.title,
      description: product.description,
      url: `/products/${product.slug}`,
      images: product.images.map((url) => ({
        url,
        width: 800,
        height: 800,
        alt: product.title,
      })),
    },
  };
}

function buildJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews.length,
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 space-y-16 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(product)).replace(/</g, "\\u003c"),
        }}
      />

      <div>
        <nav aria-label="Breadcrumb" className="text-muted mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/products" className="hover:underline">
                Products
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={buildProductsHref({ category: product.category })}
                className="capitalize hover:underline"
              >
                {product.category}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} title={product.title} />

          <div className="space-y-4">
            <p className="text-muted text-sm">{product.brand}</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-2">
              <Rating value={product.rating} />
              <a href="#reviews" className="text-muted text-sm hover:underline">
                ({product.reviews.length} reviews)
              </a>
            </div>
            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
            <StockStatus stock={product.stock} />
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                title: product.title,
                price: product.price,
                stock: product.stock,
                thumbnail: product.thumbnail,
              }}
            />
            <p className="text-muted leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      <section
        id="reviews"
        aria-labelledby="reviews-heading"
        className="scroll-mt-20"
      >
        <h2 id="reviews-heading" className="text-xl font-semibold">
          Customer reviews ({product.reviews.length})
        </h2>
        <ReviewList reviews={product.reviews} />
      </section>

      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <RelatedProducts product={product} />
      </Suspense>
    </main>
  );
}
