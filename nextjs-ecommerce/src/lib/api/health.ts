import { apiRequest } from "./client";

export type ApiHealthResponse = {
  status: string;
  service?: string;
};

export const checkApiHealth = () => apiRequest<ApiHealthResponse>("/health/", { auth: false });
