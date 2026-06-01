import { ApiList } from "@/types/api";
import { ApiCategory, ApiProduct } from "@/types/productApi";
import { apiRequest } from "./client";

export const getProducts = (query = "") => apiRequest<ApiList<ApiProduct>>(`/products/${query}`, { auth: false });
export const getProduct = (slug: string) => apiRequest<ApiProduct>(`/products/${slug}/`, { auth: false });
export const getCategories = () => apiRequest<ApiList<ApiCategory>>("/categories/", { auth: false });
