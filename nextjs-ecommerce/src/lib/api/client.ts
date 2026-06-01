import { AuthTokens } from "@/types/auth";

const DEFAULT_API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://ecommerce.schoolsoft.online/api"
    : "http://127.0.0.1:8000/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || DEFAULT_API_BASE_URL;

export const ACCESS_TOKEN_KEY = "ecommerce_access_token";
export const REFRESH_TOKEN_KEY = "ecommerce_refresh_token";
const LEGACY_TOKEN_KEY = "ecommerce_auth_tokens";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const getStoredTokens = (): AuthTokens | null => {
  if (typeof window === "undefined") return null;
  const access = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  if (access && refresh) return { access, refresh };

  const rawLegacyTokens = window.localStorage.getItem(LEGACY_TOKEN_KEY);
  if (!rawLegacyTokens) return null;

  try {
    const legacyTokens = JSON.parse(rawLegacyTokens) as Partial<AuthTokens>;
    if (legacyTokens.access && legacyTokens.refresh) {
      setStoredTokens({ access: legacyTokens.access, refresh: legacyTokens.refresh });
      window.localStorage.removeItem(LEGACY_TOKEN_KEY);
      return { access: legacyTokens.access, refresh: legacyTokens.refresh };
    }
  } catch {
    window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  }

  return null;
};

export const setStoredTokens = (tokens: AuthTokens | null) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  if (!tokens) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
};

type ApiRequestOptions = RequestInit & { auth?: boolean };

const isDevelopment = () => process.env.NODE_ENV !== "production";

export const buildApiUrl = (endpoint: string) => {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

const parseResponseBody = async (response: Response) => {
  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();
  return text || null;
};

const getErrorMessage = (data: unknown, fallback: string) => {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data !== "object") return fallback;

  const errorData = data as Record<string, unknown>;
  if (typeof errorData.detail === "string") return errorData.detail;
  if (typeof errorData.message === "string") return errorData.message;
  if (typeof errorData.error === "string") return errorData.error;

  const firstFieldError = Object.values(errorData).find((value) => {
    if (typeof value === "string") return true;
    return Array.isArray(value) && typeof value[0] === "string";
  });

  if (typeof firstFieldError === "string") return firstFieldError;
  if (Array.isArray(firstFieldError) && typeof firstFieldError[0] === "string") {
    return firstFieldError[0];
  }

  return fallback;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = true, ...fetchOptions } = options;
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (auth) {
    const tokens = getStoredTokens();
    if (tokens?.access) headers.set("Authorization", `Bearer ${tokens.access}`);
  }

  const url = buildApiUrl(path);
  const method = options.method || "GET";

  if (isDevelopment()) {
    console.debug("[api]", method, url, {
      baseUrl: API_BASE_URL,
      auth,
      headers: Array.from(headers.keys()),
    });
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
      mode: "cors",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const name = error instanceof Error ? error.name : "UnknownError";
    const stack = error instanceof Error ? error.stack : undefined;

    if (isDevelopment()) {
      console.error("[api] Network/CORS failure", {
        url,
        method,
        name,
        message,
        stack,
      });
    }

    throw new ApiError(
      0,
      `Network request failed: ${message}. Check backend URL, CORS, SSL, Nginx proxy, and whether the API server is reachable.`,
      { url, method, name, message }
    );
  }

  if (isDevelopment()) console.debug("[api] status", response.status, url);

  const data = response.status === 204 ? null : await parseResponseBody(response);

  if (!response.ok) {
    const message = getErrorMessage(data, `Request failed with status ${response.status}`);
    if (isDevelopment()) console.error("[api] error", { status: response.status, url, message });
    throw new ApiError(response.status, message, data);
  }

  if (response.status === 204) return undefined as T;
  return data as T;
}
