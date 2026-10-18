import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const consentModule = () => import("../src/lib/cookie-consent");
let local: Map<string, string>,
  session: Map<string, string>,
  cookieWrites: string[];
let gtag: ReturnType<typeof vi.fn>;
function storage(map: Map<string, string>) {
  return {
    getItem: vi.fn((key: string) => map.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      map.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      map.delete(key);
    }),
  };
}
beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-CONSENTTEST");
  vi.stubEnv("NEXT_PUBLIC_VERCEL_ANALYTICS", "false");
  local = new Map();
  session = new Map();
  cookieWrites = [];
  gtag = vi.fn();
  vi.stubGlobal("window", Object.assign(new EventTarget(), { gtag }));
  vi.stubGlobal("localStorage", storage(local));
  vi.stubGlobal("sessionStorage", storage(session));
  vi.stubGlobal("document", {
    get cookie() {
      return "_ga=123; _ga_TEST=456; app_session=keep";
    },
    set cookie(value: string) {
      cookieWrites.push(value);
    },
    referrer: "https://example.test/path",
  });
  vi.stubGlobal("location", {
    hostname: "studio.venizor.com",
    origin: "https://studio.venizor.com",
    pathname: "/contact",
    search: "?utm_source=test",
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("cookie consent policy", () => {
  it("rejects missing, malformed and unrecognized decisions", async () => {
    const { parseConsent } = await consentModule();
    for (const raw of [
      null,
      "accepted",
      "null",
      "{}",
      '{"version":2}',
      '{"analytics":"true"}',
    ])
      expect(parseConsent(raw)).toBeNull();
  });
  it("rejects expired, future-dated, overlong and provider-mismatched permission", async () => {
    const { parseConsent, CONSENT_LIFETIME } = await consentModule();
    const now = Date.now();
    const valid = {
      version: 1,
      analytics: true,
      savedAt: now,
      expiresAt: now + CONSENT_LIFETIME,
      scope: "G-CONSENTTEST",
    };
    expect(parseConsent(JSON.stringify(valid), now)).toEqual(valid);
    expect(parseConsent(JSON.stringify(valid), valid.expiresAt)).toBeNull();
    expect(parseConsent(JSON.stringify(valid), now - 1)).toBeNull();
    expect(
      parseConsent(
        JSON.stringify({ ...valid, expiresAt: valid.expiresAt + 1 }),
        now,
      ),
    ).toBeNull();
    expect(
      parseConsent(JSON.stringify(valid), now, "G-NEWPROVIDER"),
    ).toBeNull();
  });
  it("defaults to denied and does not inherit legacy analytics opt-in", async () => {
    local.set("venizor-analytics-consent", "accepted");
    const consent = await consentModule();
    expect(consent.hasAnalyticsConsent()).toBe(false);
    expect(consent.consentSnapshot()).toBeNull();
  });
  it("saves explicit permission, gates events and captures referral details only after permission", async () => {
    const consent = await consentModule();
    const { captureAttribution } = await import("../src/lib/contact");
    const { track } = await import("../src/lib/track");
    expect(captureAttribution()).toBeUndefined();
    track("generate_lead");
    expect(gtag).not.toHaveBeenCalled();
    expect(session.size).toBe(0);
    expect(consent.saveConsent(true)).toBe(true);
    expect(consent.hasAnalyticsConsent()).toBe(true);
    expect(captureAttribution()?.utm_source).toBe("test");
    track("generate_lead", { source: "contact" });
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      source: "contact",
    });
  });
  it("withdraws permission, disables Google and removes only analytics cookies and referral storage", async () => {
    const consent = await consentModule();
    consent.saveConsent(true);
    session.set("venizor-attribution", "{}");
    consent.saveConsent(false);
    expect(consent.hasAnalyticsConsent()).toBe(false);
    expect(
      (window as unknown as Record<string, unknown>)[
        "ga-disable-G-CONSENTTEST"
      ],
    ).toBe(true);
    expect(session.has("venizor-attribution")).toBe(false);
    expect(cookieWrites.some((value) => value.startsWith("_ga="))).toBe(true);
    expect(cookieWrites.some((value) => value.startsWith("_ga_TEST="))).toBe(
      true,
    );
    expect(cookieWrites.some((value) => value.startsWith("app_session="))).toBe(
      false,
    );
    expect(
      cookieWrites.some((value) => value.includes("domain=venizor.com")),
    ).toBe(true);
  });
  it("keeps the chosen permission in memory when persistence is blocked", async () => {
    const consent = await consentModule();
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error("Blocked");
    });
    expect(consent.saveConsent(true)).toBe(false);
    expect(consent.hasAnalyticsConsent()).toBe(true);
    expect(consent.saveConsent(false)).toBe(false);
    expect(consent.hasAnalyticsConsent()).toBe(false);
  });
  it("does not let a broken analytics provider prevent rejection", async () => {
    const consent = await consentModule();
    gtag.mockImplementation(() => {
      throw new Error("Provider failed");
    });
    expect(() => consent.saveConsent(false)).not.toThrow();
    expect(consent.parseConsent(consent.consentSnapshot())?.analytics).toBe(
      false,
    );
  });
  it("handles browsers that also block cookie access", async () => {
    const consent = await consentModule();
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get() {
        throw new Error("Blocked");
      },
    });
    expect(() => consent.saveConsent(false)).not.toThrow();
  });
  it("synchronizes changes and clears a stale in-memory override after a storage event", async () => {
    const consent = await consentModule();
    const callback = vi.fn();
    const unsubscribe = consent.subscribeConsent(callback);
    consent.saveConsent(true);
    expect(callback).toHaveBeenCalled();
    const raw = consent.parseConsent(consent.consentSnapshot())!;
    local.set(
      consent.CONSENT_KEY,
      JSON.stringify({ ...raw, analytics: false }),
    );
    const event = new Event("storage");
    Object.defineProperty(event, "key", { value: consent.CONSENT_KEY });
    window.dispatchEvent(event);
    expect(consent.hasAnalyticsConsent()).toBe(false);
    unsubscribe();
    callback.mockClear();
    consent.notifyConsent();
    expect(callback).not.toHaveBeenCalled();
  });
  it("never enables unavailable providers, even when asked to accept all", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "");
    const consent = await consentModule();
    consent.saveConsent(true);
    expect(consent.optionalAnalyticsAvailable).toBe(false);
    expect(consent.parseConsent(consent.consentSnapshot())?.analytics).toBe(
      false,
    );
    expect(consent.hasAnalyticsConsent()).toBe(false);
  });
});
