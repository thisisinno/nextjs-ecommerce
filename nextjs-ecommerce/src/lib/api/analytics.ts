import { apiRequest } from "./client";

export type AnalyticsPayload = {
  event_type: string;
  page?: string;
  product?: number | null;
  session_key?: string;
  metadata?: Record<string, unknown>;
};

export const trackAnalyticsEvent = (payload: AnalyticsPayload) =>
  apiRequest("/analytics-events/", { method: "POST", auth: false, body: JSON.stringify(payload) });

export const trackCartActivity = (payload: {
  action: "add" | "remove" | "update";
  product?: number | null;
  quantity?: number;
  session_key?: string;
  metadata?: Record<string, unknown>;
}) => apiRequest("/cart-activities/", { method: "POST", auth: false, body: JSON.stringify(payload) });

export const getAdminAnalytics = () => apiRequest<unknown[]>("/admin/analytics/");
export const getAdminCartActivities = () => apiRequest<unknown[]>("/admin/cart-activities/");
