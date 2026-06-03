import { ApiFilterOption } from "./filter";

export type ApiCategory = {
  id: number;
  parent?: number | null;
  title: string;
  slug: string;
  image: string;
  description: string;
  order?: number;
  is_active?: boolean;
  product_count?: number;
  children?: ApiCategory[];
};

export type ApiProductImage = {
  id: number;
  media?: number | null;
  media_detail?: {
    file?: string;
    file_url?: string;
    alt_text?: string;
  } | null;
  image: string;
  alt_text?: string;
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
  filters?: number[];
  filters_detail?: ApiFilterOption[];
  is_active: boolean;
  is_featured: boolean;
  metadata?: Record<string, unknown>;
};
