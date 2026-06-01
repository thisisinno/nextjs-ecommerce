import { AuthTokens } from "@/types/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

const TOKEN_KEY = "ecommerce_auth_tokens";

export const getStoredTokens = (): AuthTokens | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(TOKEN_KEY);
  return raw ? (JSON.parse(raw) as AuthTokens) : null;
};

export const setStoredTokens = (tokens: AuthTokens | null) => {
  if (typeof window === "undefined") return;
  if (!tokens) window.localStorage.removeItem(TOKEN_KEY);
  else window.localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

type ApiRequestOptions = RequestInit & { auth?: boolean };

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (options.auth !== false) {
    const tokens = getStoredTokens();
    if (tokens?.access) headers.set("Authorization", `Bearer ${tokens.access}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${await response.text()}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
