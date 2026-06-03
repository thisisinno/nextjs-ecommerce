import { ApiList } from "@/types/api";
import { ApiCategory, ApiProduct, ApiProductImage } from "@/types/productApi";
import { apiRequest } from "./client";

export const getProducts = (query = "") => apiRequest<ApiList<ApiProduct>>(`/products/${query}`, { auth: false });
export const getProduct = (slug: string) => apiRequest<ApiProduct>(`/products/${slug}/`, { auth: false });
export const getCategories = () => apiRequest<ApiList<ApiCategory>>("/categories/", { auth: false });

export const getAdminProducts = () => apiRequest<ApiList<ApiProduct>>("/admin/products/");
export const createProduct = (payload: Partial<ApiProduct>) =>
  apiRequest<ApiProduct>("/admin/products/", { method: "POST", body: JSON.stringify(payload) });
export const updateProduct = (id: number, payload: Partial<ApiProduct>) =>
  apiRequest<ApiProduct>(`/admin/products/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteProduct = (id: number) => apiRequest<void>(`/admin/products/${id}/`, { method: "DELETE" });
export const addProductImage = (productId: number, payload: Partial<ApiProductImage>) =>
  apiRequest<ApiProductImage>(`/admin/products/${productId}/images/`, { method: "POST", body: JSON.stringify(payload) });
export const deleteProductImage = (id: number) => apiRequest<void>(`/admin/product-images/${id}/`, { method: "DELETE" });

export const getAdminCategories = () => apiRequest<ApiList<ApiCategory>>("/admin/categories/");
export const createCategory = (payload: Partial<ApiCategory>) =>
  apiRequest<ApiCategory>("/admin/categories/", { method: "POST", body: JSON.stringify(payload) });
export const updateCategory = (id: number, payload: Partial<ApiCategory>) =>
  apiRequest<ApiCategory>(`/admin/categories/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteCategory = (id: number) => apiRequest<void>(`/admin/categories/${id}/`, { method: "DELETE" });
