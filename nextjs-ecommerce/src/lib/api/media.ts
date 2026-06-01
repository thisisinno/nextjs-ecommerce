import { ApiMediaAsset } from "@/types/media";
import { apiRequest } from "./client";

export const uploadMedia = (file: File, payload: Partial<ApiMediaAsset> = {}) => {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
    }
  });
  return apiRequest<ApiMediaAsset>("/admin/media/", { method: "POST", body: formData });
};

export const updateMedia = (id: number, payload: Partial<ApiMediaAsset>) =>
  apiRequest<ApiMediaAsset>(`/admin/media/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });

export const deleteMedia = (id: number) => apiRequest<void>(`/admin/media/${id}/`, { method: "DELETE" });
