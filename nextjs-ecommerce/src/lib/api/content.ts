import { ApiContentBlock, ApiPage, ApiSection } from "@/types/content";
import { ApiList } from "@/types/api";
import { apiRequest } from "./client";

export const getPages = () => apiRequest<ApiList<ApiPage>>("/pages/", { auth: false });
export const getPage = (slug: string) => apiRequest<ApiPage>(`/pages/${slug}/`, { auth: false });
export const getSections = () => apiRequest<ApiList<ApiSection>>("/sections/", { auth: false });
export const getContentBlocks = () => apiRequest<ApiList<ApiContentBlock>>("/content-blocks/", { auth: false });

export const createContentBlock = (payload: Partial<ApiContentBlock>) =>
  apiRequest<ApiContentBlock>("/admin/content-blocks/", { method: "POST", body: JSON.stringify(payload) });

export const updateContentBlock = (id: number, payload: Partial<ApiContentBlock>) =>
  apiRequest<ApiContentBlock>(`/admin/content-blocks/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });

export const deleteContentBlock = (id: number) =>
  apiRequest<void>(`/admin/content-blocks/${id}/`, { method: "DELETE" });
