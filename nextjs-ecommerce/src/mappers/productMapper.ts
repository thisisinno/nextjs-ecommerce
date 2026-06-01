import { Product } from "@/types/product";
import { ApiProduct } from "@/types/productApi";

const byType = (product: ApiProduct, type: string) =>
  product.images?.filter((image) => image.image_type === type).map((image) => image.image).filter(Boolean) ?? [];

export function mapProduct(product: ApiProduct): Product {
  const thumbnails = byType(product, "thumbnail");
  const previews = byType(product, "preview");
  return {
    id: product.id,
    title: product.title,
    reviews: Number(product.metadata?.reviews ?? 0),
    price: Number(product.price),
    discountedPrice: Number(product.discounted_price ?? product.price),
    imgs: {
      thumbnails: thumbnails.length ? thumbnails : previews,
      previews: previews.length ? previews : thumbnails,
    },
  };
}

export const mapProducts = (products: ApiProduct[]) => products.map(mapProduct);
