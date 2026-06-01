import { ApiList } from "@/types/api";
import { ApiFilterGroup, ApiFilterOption } from "@/types/filter";
import { apiRequest } from "./client";

export const getFilterGroups = () => apiRequest<ApiList<ApiFilterGroup>>("/filter-groups/", { auth: false });
export const createFilterGroup = (payload: Partial<ApiFilterGroup>) => apiRequest<ApiFilterGroup>("/admin/filter-groups/", { method: "POST", body: JSON.stringify(payload) });
export const updateFilterGroup = (id: number, payload: Partial<ApiFilterGroup>) => apiRequest<ApiFilterGroup>(`/admin/filter-groups/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteFilterGroup = (id: number) => apiRequest<void>(`/admin/filter-groups/${id}/`, { method: "DELETE" });
export const createFilterOption = (payload: Partial<ApiFilterOption>) => apiRequest<ApiFilterOption>("/admin/filter-options/", { method: "POST", body: JSON.stringify(payload) });
export const updateFilterOption = (id: number, payload: Partial<ApiFilterOption>) => apiRequest<ApiFilterOption>(`/admin/filter-options/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteFilterOption = (id: number) => apiRequest<void>(`/admin/filter-options/${id}/`, { method: "DELETE" });
