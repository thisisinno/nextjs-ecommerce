import { ApiMenu, ApiMenuItem } from "@/types/content";
import { ApiList } from "@/types/api";
import { apiRequest } from "./client";

export const getMenus = () => apiRequest<ApiList<ApiMenu>>("/menus/", { auth: false });
export const createMenu = (payload: Partial<ApiMenu>) => apiRequest<ApiMenu>("/admin/menus/", { method: "POST", body: JSON.stringify(payload) });
export const updateMenu = (id: number, payload: Partial<ApiMenu>) => apiRequest<ApiMenu>(`/admin/menus/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteMenu = (id: number) => apiRequest<void>(`/admin/menus/${id}/`, { method: "DELETE" });
export const createMenuItem = (payload: Partial<ApiMenuItem> & { menu: number; parent?: number | null }) => apiRequest<ApiMenuItem>("/admin/menu-items/", { method: "POST", body: JSON.stringify(payload) });
export const updateMenuItem = (id: number, payload: Partial<ApiMenuItem>) => apiRequest<ApiMenuItem>(`/admin/menu-items/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteMenuItem = (id: number) => apiRequest<void>(`/admin/menu-items/${id}/`, { method: "DELETE" });
