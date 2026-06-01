import { apiRequest } from "./client";

export const getAdminOrders = () => apiRequest<unknown[]>("/admin/orders/");
