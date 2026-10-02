export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  reviews: Review[];
}

export type ProductSummary = Pick<
  Product,
  | "id"
  | "slug"
  | "title"
  | "brand"
  | "category"
  | "price"
  | "rating"
  | "stock"
  | "thumbnail"
>;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
