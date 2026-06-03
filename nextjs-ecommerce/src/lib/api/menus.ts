import { ApiMenu, ApiMenuItem } from "@/types/content";
import { ApiList } from "@/types/api";
import { menuData } from "@/components/Header/menuData";
import { Menu } from "@/types/Menu";
import { apiRequest } from "./client";

const mapFallbackMenuItem = (item: Menu, order: number): ApiMenuItem => ({
  id: item.id,
  title: item.title,
  path: item.path,
  order,
  is_active: true,
  metadata: { newTab: item.newTab },
  children: item.submenu?.map(mapFallbackMenuItem),
});

const fallbackMenuData: ApiList<ApiMenu> = [
  {
    id: 1,
    name: "Header",
    location: "header",
    is_active: true,
    items: menuData.map(mapFallbackMenuItem),
  },
];

export async function getMenus() {
  try {
    return await apiRequest<ApiList<ApiMenu>>("/menus/", { auth: false, silent: true });
  } catch {
    return fallbackMenuData;
  }
}

export const createMenu = (payload: Partial<ApiMenu>) => apiRequest<ApiMenu>("/admin/menus/", { method: "POST", body: JSON.stringify(payload) });
export const updateMenu = (id: number, payload: Partial<ApiMenu>) => apiRequest<ApiMenu>(`/admin/menus/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteMenu = (id: number) => apiRequest<void>(`/admin/menus/${id}/`, { method: "DELETE" });
export const createMenuItem = (payload: Partial<ApiMenuItem> & { menu: number; parent?: number | null }) => apiRequest<ApiMenuItem>("/admin/menu-items/", { method: "POST", body: JSON.stringify(payload) });
export const updateMenuItem = (id: number, payload: Partial<ApiMenuItem>) => apiRequest<ApiMenuItem>(`/admin/menu-items/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteMenuItem = (id: number) => apiRequest<void>(`/admin/menu-items/${id}/`, { method: "DELETE" });
