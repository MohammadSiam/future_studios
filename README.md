# ShopNext — E-Commerce Product Search & Checkout

A high-performance e-commerce app with product browsing, URL-driven search and filters, a persistent cart, and a validated checkout.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zustand · React Hook Form · Zod · lucide-react icons

**Live demo:** _add deployment URL here_

## Features

- **520 products** across 10 categories, served by an API service layer
- **Search, category, price, rating, sorting and pagination**, all stored in the URL (shareable and preserved across refreshes)
- **Product details** with image gallery, stock status, reviews and related products
- **Shopping cart** with add, remove and quantity controls, capped at available stock and persisted to `localStorage`
- **Checkout** with React Hook Form + Zod, re-validated on the server by a Server Action
- **SEO:** statically generated product pages, per-page metadata, Open Graph, JSON-LD, canonical URLs, `sitemap.xml` and `robots.txt`
- **Loading, empty and error states** on every data-driven view
- **Responsive and accessible**, with a mobile filter drawer (Lighthouse: Accessibility 100, SEO 100)

## Getting started

Requirements: **Node.js 20.9+** and **pnpm 10**.

```bash
pnpm install
cp .env.example .env.local   # optional: set NEXT_PUBLIC_SITE_URL for canonical/OG URLs
pnpm dev                     # http://localhost:3000
```

| Script               | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `pnpm dev`           | Start the dev server (Turbopack)                                              |
| `pnpm build`         | Production build (pre-renders all 520 product pages)                          |
| `pnpm start`         | Serve the production build                                                    |
| `pnpm lint`          | ESLint                                                                        |
| `pnpm type-check`    | Generate route types and run `tsc --noEmit`                                   |
| `pnpm format`        | Format with Prettier                                                          |
| `pnpm generate:data` | Regenerate `src/lib/data/products.json` (seeded, so the output never changes) |

## Architecture & folder structure

```
scripts/
  generate-products.ts      Seeded Faker script that builds the 520-product dataset
src/
  app/                      Routes only: pages, layouts, metadata and route handlers
    products/               Listing (dynamic) + [slug] details (SSG), error/not-found UI
    cart/                   Cart page
    checkout/               Checkout page, success page, placeOrder Server Action
    api/products/           REST route handlers backed by the service layer
    sitemap.ts, robots.ts   SEO metadata routes
  components/
    ui/                     Reusable building blocks (Button, Input, Select, Skeleton, Rating, EmptyState)
    products/               Listing and details components
    cart/                   Cart components
    checkout/               Checkout form and view
    layout/                 Site header
  hooks/                    useProductFilters (URL state), useDebouncedCallback
  lib/
    api/products.ts         Product service layer (server-only)
    schemas/                Zod schemas: product query, checkout, order
    data/products.json      Dataset
    cart.ts                 Cart totals (shared by cart and checkout)
    products-href.ts        Builds listing URLs from a query object
  store/cart.ts             Zustand cart store + hydration hook
  types/                    Domain types
```

**Principles**

- **Routes stay thin.** Pages read params, call the service layer and compose components. Business logic lives in `lib/`.
- **One source of truth per concern.** The URL owns filter state, Zustand owns the cart, and Zod schemas own validation (shared by client and server).
- **Client Components are leaves.** Interactivity is pushed to the smallest component that needs it.

## API & data-fetching approach

- **Service layer (`src/lib/api/products.ts`)** exposes `getProducts(query)`, `getProductBySlug(slug)`, `getRelatedProducts(product)`, `getCategories()` and `getAllSlugs()`.
  - It is marked `import "server-only"`, so it can never be bundled into the browser.
  - All functions are async, so the JSON source could be swapped for a database or remote API without touching components.
- **Server Components call the service directly** rather than making an HTTP round-trip to their own API.
- **Route Handlers expose the same service as a REST API** for external clients:

  | Endpoint                           | Description                                                                              |
  | ---------------------------------- | ---------------------------------------------------------------------------------------- |
  | `GET /api/products`                | Paginated list. Query: `q`, `category`, `minPrice`, `maxPrice`, `rating`, `sort`, `page` |
  | `GET /api/products/[slug]`         | Product details, `404` if not found                                                      |
  | `GET /api/products/[slug]/related` | Up to 8 top-rated products from the same category, `404` if not found                    |

- **Query validation:** `productQuerySchema` parses the raw search params. Invalid values (e.g. `page=abc`, `sort=bogus`) fall back to defaults instead of crashing, and an out-of-range page is clamped to the last page.
- **No over-fetching:** list responses return only the 9 fields a product card needs (no descriptions or reviews), 24 per page. The cart sends only 6 fields to the client.
- **No duplicate calls:** `getProductBySlug` is wrapped in React `cache()`, so `generateMetadata` and the page share one lookup per request.
- **Orders:** the `placeOrder` Server Action re-validates the form with the same Zod schema, then checks every item against the server-side product data. Clients send only `slug` and `quantity`, so client-side prices can't be tampered with.
- **Error handling:**
  - Unknown slugs call `notFound()` and return a real 404 status.
  - `products/error.tsx` and `global-error.tsx` provide a retry option.
  - Empty results render an empty state with a "Clear all filters" link.

## Server vs Client Components

Everything is a Server Component unless it needs browser state or event handlers.

| Route                       | Rendering                                   | Why                                                                      |
| --------------------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| `/products`                 | Dynamic (server-rendered per request)       | Depends on `searchParams`                                                |
| `/products/[slug]`          | **Static (SSG)** via `generateStaticParams` | 520 pages pre-rendered at build time for speed and SEO                   |
| `/cart`, `/checkout`        | Static shell + client island                | Cart data lives in `localStorage`, so it can only be read in the browser |
| `/checkout/success`         | Dynamic                                     | Reads `orderId` from the URL                                             |
| `sitemap.xml`, `robots.txt` | Static                                      | Generated at build time                                                  |

| Server Components (no JS shipped)                                                                                                                  | Client Components (`"use client"`)                                         | Why client                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------- |
| Pages, `SiteHeader`, `ProductResults`, `ProductGrid`, `ProductCard`, `FilterSidebar`, `Pagination`, `ReviewList`, `RelatedProducts`, `StockStatus` | `SearchBar`, `SortSelect`, `PriceFilter`                                   | Update the URL from user input            |
|                                                                                                                                                    | `FilterDrawer`                                                             | Open/close state, Escape key, scroll lock |
|                                                                                                                                                    | `ProductGallery`                                                           | Selected-image state                      |
|                                                                                                                                                    | `AddToCartButton`, `CartBadge`, `CartView`, `CheckoutView`, `CheckoutForm` | Read and write the cart store, form state |
|                                                                                                                                                    | `error.tsx`, `global-error.tsx`                                            | Required by Next.js for error boundaries  |

Notable patterns:

- **Filters are mostly links.** Category, rating, pagination and "Clear all filters" are server-rendered `<Link>`s built with `buildProductsHref`. They work without JavaScript and search engines can crawl them. Only inputs that need typing or selecting are client components.
- **Streaming with keyed Suspense.** On `/products`, the header and filters render immediately, while results stream inside `<Suspense key={JSON.stringify(query)}>`. Changing the key on every filter change shows the skeleton straight away.
- **Server children inside client wrappers.** `FilterDrawer` is a client component, but it receives the server-rendered `FilterSidebar` as `children`, so the sidebar stays server-rendered.
- **Hydration-safe cart.** `useCartHydrated()` (built on `useSyncExternalStore`) returns `false` on the server and during hydration. Cart-dependent UI shows a skeleton or a 0 count until `localStorage` has loaded, so the server and client HTML never mismatch.

## Performance decisions

**`useMemo`**

- Cart totals (`calculateCartTotals`) in `CartView` and `CheckoutView` are recalculated only when the `items` array changes.
- It's _not_ used for cheap values like booleans or string labels, where memoizing would cost more than it saves.

**`useCallback`**

- `useProductFilters` memoizes `setFilters` with `useCallback`, keyed on the router, pathname and search params, so the search, sort and price controls get the same function until the URL actually changes.
- `useDebouncedCallback` returns a stable function. It stores the latest callback in a ref, so the 400 ms timer is never reset just because the parent re-rendered.
- It's _not_ used for cart handlers, because Zustand actions already never change identity.

**`React.memo`**

- `CartLineItem` is memoized. The store updates items immutably, so changing one row's quantity creates a new object only for that row, and the other rows skip re-rendering. Its handler props are stable Zustand actions, so the memo is actually effective.
- `ProductCard` is a Server Component, so it never re-renders on the client and needs no `memo`. Only its add-to-cart icon button is a client component, and it receives just the 6 cart fields.

**Re-render control**

- Each component subscribes to only the store slice it uses. For example, `CartBadge` selects only the item count, and `AddToCartButton` selects only its own product's quantity.
- Inputs that don't need React state are uncontrolled:
  - The search input uses `defaultValue`, plus one effect that copies in outside URL changes (Clear all, back/forward), skipped while the input is focused.
  - Price inputs are read from `FormData` on submit and reset via a `key` when the URL changes.
  - The sort dropdown remounts via a `key` when the URL changes.
- `FilterDrawer` closes on URL changes by adjusting state during render (React's recommended pattern), rather than with an extra effect.

**Effects and cleanup** — `useEffect` is used only for real side effects, and every one cleans up:

| Where                  | Side effect                               | Cleanup                                 |
| ---------------------- | ----------------------------------------- | --------------------------------------- |
| `useDebouncedCallback` | Debounce timer                            | Clears the timer on unmount             |
| `AddToCartButton`      | 2 s "Added ✓" feedback timer              | Clears the timer on change or unmount   |
| `FilterDrawer`         | Escape listener + body scroll lock        | Removes the listener, restores overflow |
| `SearchBar`            | Copies outside URL changes into the input | —                                       |

**Rendering and loading**

- Product pages are pre-rendered (SSG), so navigation from the listing is effectively instant.
- `next/image` handles responsive `sizes` and WebP output. Only the first 4 listing cards and the main gallery image are preloaded (`preload`), to help the largest-image load (LCP) without wasting bandwidth.
- The search is debounced by 400 ms, and filter navigation uses `router.replace({ scroll: false })` so typing doesn't flood the history.
- Lighthouse (mobile, production build):

  | Page            | Performance | Accessibility | Best practices | SEO |
  | --------------- | ----------- | ------------- | -------------- | --- |
  | `/products`     | 95          | 100           | 100            | 100 |
  | Product details | 95–97       | 100           | 100            | 100 |

## SEO

- `generateMetadata` provides a title, description, canonical URL and Open Graph images for each product.
- Product pages include JSON-LD (`Product`, `Offer`, `AggregateRating`), with `<` escaped to prevent XSS.
- On the listing, canonical URLs keep `category` and `page` but drop `sort`, and search results are `noindex, follow`.
- Cart, checkout and success pages are `noindex`. `robots.txt` blocks `/api/`, `/cart` and `/checkout`.
- `sitemap.xml` lists `/products` plus all 520 product URLs.
- The markup is semantic: breadcrumbs, `<nav>`/`<main>`/`<section>` landmarks, and labelled form controls.

## Known limitations

- The dataset is a static JSON file loaded into memory, and placed orders aren't persisted. Both are expected for a mock API, and the service layer is the single place to swap in a real backend.
- **Product images are placeholders, not real product photos.** They are random stock photos (landscapes, animals, etc.) from [`picsum.photos`](https://picsum.photos), picked by a seed per product. A product's image therefore won't match its name or category — for example, "Wooden Soap" may show a seascape. Each product still always gets the same images. Real photos can be dropped in by changing the `images`/`thumbnail` URLs in the dataset (and allowing the new host in `next.config.ts`).
- Product names, descriptions and brands are random Faker data, so they may not match their category either. Review text is Faker placeholder (Latin) copy.

## AI-assisted development

This project was built with AI assistance (Claude Code), working in reviewed stages: setup → data and API layer → listing → details → cart → checkout → SEO and responsive polish → docs. Each stage was checked with type-checking, linting, a production build, browser tests (Playwright) and Lighthouse before moving on.
