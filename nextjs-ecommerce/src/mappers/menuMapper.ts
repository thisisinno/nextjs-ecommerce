import { ApiMenuItem } from "@/types/content";
import { Menu } from "@/types/Menu";

export function mapMenuItem(item: ApiMenuItem): Menu {
  return {
    id: item.id,
    title: item.title,
    path: item.path,
    newTab: Boolean(item.metadata?.newTab),
    submenu: item.children?.map(mapMenuItem),
  };
}

export const mapMenuItems = (items: ApiMenuItem[]) => items.map(mapMenuItem);
