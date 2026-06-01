"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { trackAnalyticsEvent, trackCartActivity } from "@/lib/api/analytics";

const SESSION_KEY = "ecommerce_session_key";

export function getSessionKey() {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(SESSION_KEY);
  if (!key) {
    key = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, key);
  }
  return key;
}

export function useAnalyticsTracker() {
  const pathname = usePathname();
  const sessionKey = useMemo(getSessionKey, []);

  useEffect(() => {
    if (!pathname) return;
    trackAnalyticsEvent({ event_type: "page_view", page: pathname, session_key: sessionKey }).catch(() => undefined);
  }, [pathname, sessionKey]);

  return {
    track: (event_type: string, metadata: Record<string, unknown> = {}) =>
      trackAnalyticsEvent({ event_type, page: pathname, session_key: sessionKey, metadata }).catch(() => undefined),
    trackCart: (action: "add" | "remove" | "update", metadata: Record<string, unknown> = {}, quantity = 1) =>
      trackCartActivity({ action, quantity, session_key: sessionKey, metadata }).catch(() => undefined),
  };
}
