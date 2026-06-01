import { apiRequest, setStoredTokens } from "./client";
import { ApiUser, AuthTokens } from "@/types/auth";

export async function login(username: string, password: string) {
  const tokens = await apiRequest<AuthTokens>("/auth/token/", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ username, password }),
  });
  setStoredTokens(tokens);
  return tokens;
}

export function logout() {
  setStoredTokens(null);
}

export function getCurrentUser() {
  return apiRequest<ApiUser>("/auth/me/");
}
