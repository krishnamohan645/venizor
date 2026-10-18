"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  consentSnapshot,
  notifyConsent,
  parseConsent,
  subscribeConsent,
  syncAnalyticsPermission,
} from "./cookie-consent";

export function useCookieConsent() {
  const raw = useSyncExternalStore(
    subscribeConsent,
    consentSnapshot,
    () => null,
  );
  useEffect(() => {
    syncAnalyticsPermission();
    const consent = parseConsent(raw);
    let timer: ReturnType<typeof setTimeout>;
    function checkExpiry() {
      if (!consent) return;
      const remaining = consent.expiresAt - Date.now();
      if (remaining <= 0) {
        syncAnalyticsPermission();
        notifyConsent();
      } else
        timer = setTimeout(
          checkExpiry,
          Math.min(remaining + 10, 24 * 60 * 60 * 1000),
        );
    }
    checkExpiry();
    const check = () => {
      syncAnalyticsPermission();
      notifyConsent();
    };
    window.addEventListener("focus", check);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", check);
    };
  }, [raw]);
  return raw;
}
