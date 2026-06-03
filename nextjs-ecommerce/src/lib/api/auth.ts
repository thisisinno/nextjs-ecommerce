import {
  ACCESS_TOKEN_KEY,
  apiRequest,
  buildApiUrl,
  REFRESH_TOKEN_KEY,
  setStoredTokens,
} from "./client";
import { ApiUser, AuthTokens } from "@/types/auth";

const isDevelopment = () => process.env.NODE_ENV !== "production";

export async function loginUser(identifier: string, password: string) {
  if (isDevelopment()) {
    console.debug("[auth] login request", {
      method: "POST",
      url: buildApiUrl("/auth/token/"),
      payload: { username: identifier, password: "[redacted]" },
      expectedContentType: "application/json",
    });
  }

  const tokens = await apiRequest<AuthTokens>("/auth/token/", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ username: identifier, password }),
  });

  setStoredTokens(tokens);
  const user = await getCurrentUser();

  return {
    tokens,
    user,
  };
}

export function logoutUser() {
  setStoredTokens(null);
}

export function getStoredAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getCurrentUser() {
  const access = getStoredAccessToken();
  if (!access) return Promise.resolve(null);
  return apiRequest<ApiUser>("/auth/me/", { silent: true });
}

export async function refreshAccessToken() {
  const refresh = getStoredRefreshToken();
  if (!refresh) throw new Error("No refresh token is stored.");

  const tokens = await apiRequest<Pick<AuthTokens, "access">>("/auth/token/refresh/", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ refresh }),
  });

  const nextTokens = { access: tokens.access, refresh };
  setStoredTokens(nextTokens);
  return tokens.access;
}

export async function isAdminUser() {
  const user = await getCurrentUser();
  return Boolean(user?.is_staff || user?.is_superuser);
}

export const login = loginUser;
export const logout = logoutUser;
