import { ApiContentBlock, ApiPage, ApiSection } from "@/types/content";
import { ApiList } from "@/types/api";
import { apiRequest } from "./client";

export const getPages = () => apiRequest<ApiList<ApiPage>>("/pages/", { auth: false });
export const getPage = (slug: string) => apiRequest<ApiPage>(`/pages/${slug}/`, { auth: false });
export const getSections = () => apiRequest<ApiList<ApiSection>>("/sections/", { auth: false });
export const getContentBlocks = (params?: { page?: string; section?: string }) => {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", params.page);
  if (params?.section) search.set("section", params.section);
  const query = search.toString();
  return apiRequest<ApiList<ApiContentBlock>>(`/content-blocks/${query ? `?${query}` : ""}`, { auth: false });
};

export const createContentBlock = (payload: Partial<ApiContentBlock>) =>
  apiRequest<ApiContentBlock>("/admin/content-blocks/", { method: "POST", body: JSON.stringify(payload) });

export const updateContentBlock = (id: number, payload: Partial<ApiContentBlock>) =>
  apiRequest<ApiContentBlock>(`/admin/content-blocks/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });

export const upsertContentBlock = (payload: {
  blockId?: number | null;
  pageSlug: string;
  pageTitle?: string;
  sectionKey: string;
  sectionTitle?: string;
  key: string;
  content_type: string;
  value: string;
  metadata?: Record<string, unknown>;
  media?: number | null;
}) => {
  const contentType = payload.content_type === "label" ? "text" : payload.content_type;

  if (payload.blockId) {
    return updateContentBlock(payload.blockId, {
      content_type: contentType,
      value: payload.value,
      metadata: payload.metadata,
      media: payload.media,
    });
  }

  return apiRequest<ApiContentBlock>("/admin/content-blocks/upsert/", {
    method: "POST",
    body: JSON.stringify({
      page_slug: payload.pageSlug,
      page_title: payload.pageTitle,
      section_key: payload.sectionKey,
      section_title: payload.sectionTitle,
      key: payload.key,
      content_type: contentType,
      value: payload.value,
      metadata: payload.metadata ?? {},
      media: payload.media,
    }),
  });
};

export const deleteContentBlock = (id: number) =>
  apiRequest<void>(`/admin/content-blocks/${id}/`, { method: "DELETE" });
