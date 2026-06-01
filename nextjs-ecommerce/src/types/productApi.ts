import { ApiFilterOption } from "./filter";

export type ApiCategory = {
  id: number;
  title: string;
  slug: string;
  image: string;
  description: string;
  product_count?: number;
};

export type ApiProductImage = {
  id: number;
  image: string;
  image_type: "thumbnail" | "preview" | string;
  order: number;
};

export type ApiProduct = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string | number;
  discounted_price?: string | number | null;
  category?: number | null;
  category_detail?: ApiCategory | null;
  stock: number;
  images: ApiProductImage[];
  filters_detail?: ApiFilterOption[];
  is_active: boolean;
  is_featured: boolean;
  metadata?: Record<string, unknown>;
};
