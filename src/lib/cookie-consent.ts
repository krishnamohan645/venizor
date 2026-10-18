export const CONSENT_KEY = "venizor-cookie-consent";
export const CONSENT_EVENT = "venizor-cookie-consent-change";
export const PREFERENCES_EVENT = "venizor-cookie-settings";
export const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;
export const googleAnalyticsId = /^G-[A-Z0-9]+$/.test(
  process.env.NEXT_PUBLIC_GA_ID || "",
)
  ? process.env.NEXT_PUBLIC_GA_ID!
  : "";
export const vercelAnalyticsEnabled =
  process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "true";
export const optionalAnalyticsAvailable = Boolean(
  googleAnalyticsId || vercelAnalyticsEnabled,
);
export const consentScope =
  [googleAnalyticsId, vercelAnalyticsEnabled ? "vercel" : ""]
    .filter(Boolean)
    .join("|") || "none";

export interface CookieConsent {
  version: 1;
  analytics: boolean;
  scope: string;
  savedAt: number;
  expiresAt: number;
}
let tabOnlyConsent: string | undefined;

export function parseConsent(
  raw: string | null,
  now?: number,
  scope = consentScope,
): CookieConsent | null {
  if (!raw) return null;
  const currentTime = now ?? Date.now();
  try {
    const value = JSON.parse(raw) as CookieConsent;
    if (
      value.version !== 1 ||
      typeof value.analytics !== "boolean" ||
      value.scope !== scope ||
      !Number.isFinite(value.savedAt) ||
      !Number.isFinite(value.expiresAt) ||
      value.savedAt > currentTime ||
      value.expiresAt <= currentTime ||
      value.expiresAt - value.savedAt > CONSENT_LIFETIME ||
      value.expiresAt <= value.savedAt
    )
      return null;
    return value;
  } catch {
    return null;
  }
}

export function consentSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = tabOnlyConsent ?? localStorage.getItem(CONSENT_KEY);
    return parseConsent(raw) ? raw : null;
  } catch {
    return parseConsent(tabOnlyConsent ?? null) ? tabOnlyConsent! : null;
  }
}
export function hasAnalyticsConsent() {
  return (
    optionalAnalyticsAvailable &&
    parseConsent(consentSnapshot())?.analytics === true
  );
}
export function subscribeConsent(callback: () => void) {
  const changed = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) {
      tabOnlyConsent = undefined;
      callback();
    }
  };
  window.addEventListener("storage", changed);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", changed);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}
export function notifyConsent() {
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function syncAnalyticsPermission() {
  const allowed = hasAnalyticsConsent();
  if (googleAnalyticsId)
    (window as unknown as Record<string, unknown>)[
      `ga-disable-${googleAnalyticsId}`
    ] = !allowed;
  try {
    window.gtag?.("consent", "update", {
      analytics_storage: allowed ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  } catch {
    /* A provider failure must not block a privacy choice. */
  }
  if (!allowed) {
    try {
      sessionStorage.removeItem("venizor-attribution");
    } catch {
      /* Storage may be unavailable. */
    }
    try {
      const names = document.cookie
        .split(";")
        .map((cookie) => cookie.trim().split("=")[0])
        .filter((name) => /^(_ga($|_)|_gid$|_gat($|_))/.test(name));
      const host = location.hostname.split(".");
      const domains = [
        "",
        ...host
          .map((_, index) => host.slice(index).join("."))
          .filter((domain) => domain.includes("."))
          .map((domain) => `; domain=${domain}`),
      ];
      for (const name of names)
        for (const domain of domains)
          document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain}`;
    } catch {
      /* Some browsers block cookie access entirely. */
    }
  }
}

export function saveConsent(analytics: boolean) {
  const now = Date.now();
  const raw = JSON.stringify({
    version: 1,
    analytics: optionalAnalyticsAvailable && analytics,
    scope: consentScope,
    savedAt: now,
    expiresAt: now + CONSENT_LIFETIME,
  } satisfies CookieConsent);
  let persistent = true;
  try {
    localStorage.setItem(CONSENT_KEY, raw);
    tabOnlyConsent = undefined;
  } catch {
    tabOnlyConsent = raw;
    persistent = false;
  }
  try {
    localStorage.removeItem("venizor-analytics-consent");
  } catch {
    /* Legacy cleanup is independent of saving the choice. */
  }
  syncAnalyticsPermission();
  notifyConsent();
  return persistent;
}
export function openCookieSettings() {
  window.dispatchEvent(new Event(PREFERENCES_EVENT));
}
