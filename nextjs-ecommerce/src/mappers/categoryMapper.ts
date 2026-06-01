import { Category } from "@/types/category";
import { ApiCategory } from "@/types/productApi";

export function mapCategory(category: ApiCategory): Category {
  return {
    id: category.id,
    title: category.title,
    img: category.image,
  };
}

export const mapCategories = (categories: ApiCategory[]) => categories.map(mapCategory);
