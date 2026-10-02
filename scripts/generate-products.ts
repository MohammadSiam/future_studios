import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { faker } from "@faker-js/faker";
import type { Product, Review } from "../src/types/product";

const PRODUCT_COUNT = 520;
const CATEGORIES = [
  "electronics",
  "fashion",
  "home",
  "beauty",
  "sports",
  "books",
  "toys",
  "grocery",
  "automotive",
  "garden",
];
const REFERENCE_DATE = new Date("2026-01-01");

faker.seed(42);

function imageUrl(seed: string, size: number) {
  return `https://picsum.photos/seed/${seed}/${size}/${size}`;
}

function createReview(): Review {
  return {
    id: faker.string.uuid(),
    author: faker.person.fullName(),
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentences({ min: 1, max: 3 }),
    date: faker.date.past({ years: 2, refDate: REFERENCE_DATE }).toISOString(),
  };
}

function createProduct(index: number): Product {
  const id = String(index + 1);
  const title = faker.commerce.productName();
  const reviews = faker.helpers.multiple(createReview, {
    count: { min: 1, max: 8 },
  });
  const rating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const images = Array.from(
    { length: faker.number.int({ min: 3, max: 4 }) },
    (_, i) => imageUrl(`product-${id}-${i}`, 800),
  );

  return {
    id,
    slug: `${faker.helpers.slugify(title).toLowerCase()}-${id}`,
    title,
    description: faker.commerce.productDescription(),
    brand: faker.company.name(),
    category: faker.helpers.arrayElement(CATEGORIES),
    price: Number(faker.commerce.price({ min: 5, max: 2000 })),
    rating: Math.round(rating * 10) / 10,
    stock:
      faker.helpers.maybe(() => 0, { probability: 0.08 }) ??
      faker.number.int({ min: 1, max: 100 }),
    thumbnail: imageUrl(`product-${id}-0`, 400),
    images,
    reviews,
  };
}

const products = Array.from({ length: PRODUCT_COUNT }, (_, i) =>
  createProduct(i),
);
const outputPath = join(import.meta.dirname, "../src/lib/data/products.json");

writeFileSync(outputPath, JSON.stringify(products));
console.log(`Generated ${products.length} products → ${outputPath}`);
