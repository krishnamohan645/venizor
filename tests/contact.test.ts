import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  records: new Map<string, unknown>(),
  pending: new Map<string, number>(),
  allowed: true,
  capture: vi.fn(),
  deferred: [] as (() => Promise<void>)[],
  expiry: new Map<string, number>(),
}));
vi.mock("next/server", () => ({
  after: (callback: () => Promise<void>) => state.deferred.push(callback),
}));
vi.mock("@sentry/nextjs", () => ({
  captureException: state.capture,
  captureMessage: state.capture,
}));
vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: () => ({
      get: async (key: string) =>
        state.records.has(key) ? structuredClone(state.records.get(key)) : null,
      set: async (
        key: string,
        value: unknown,
        options?: { nx?: boolean; ex?: number },
      ) => {
        if (options?.nx && state.records.has(key)) return null;
        state.records.set(key, structuredClone(value));
        if (options?.ex) state.expiry.set(key, options.ex);
        return "OK";
      },
      del: async (key: string) => state.records.delete(key),
      zadd: async (_key: string, value: { member: string; score: number }) =>
        state.pending.set(value.member, value.score),
      zrem: async (_key: string, id: string) => state.pending.delete(id),
      eval: async (_script: string, keys: string[], args: string[]) => {
        if (state.records.get(keys[0]) === args[0])
          state.records.delete(keys[0]);
      },
    }),
  },
}));
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow() {
      return {};
    }
    async limit() {
      return { success: state.allowed, reset: Date.now() + 60000 };
    }
  },
}));

import { POST } from "@/app/api/contact/route";
import { deliverLead } from "@/lib/lead-delivery";

const id = "946a8a54-c56a-4ed1-a5ba-f5de725c456b";
const baseLead = {
  requestId: id,
  name: "Test Person",
  email: "test@example.com",
  service: "Web application",
  message: "A test project brief for an internal portal.",
  token: "test-token",
  source: "contact",
  company_website: "",
};
function request(
  overrides: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) {
  return new Request("https://venizor.com/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://venizor.com",
      "x-forwarded-for": "192.0.2.1",
      ...headers,
    },
    body: JSON.stringify({ ...baseLead, ...overrides }),
  });
}
function provider(
  options: {
    turnstile?: boolean;
    hostname?: string;
    email?: boolean;
    crm?: boolean;
    missingEmailId?: boolean;
  } = {},
) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = String(input);
    if (url.includes("siteverify"))
      return Response.json({
        success: options.turnstile !== false,
        hostname: options.hostname || "venizor.com",
        action: "contact",
      });
    if (url.includes("api.resend.com"))
      return Response.json(
        options.email === false
          ? { error: "unavailable" }
          : options.missingEmailId
            ? {}
            : { id: "email-id" },
        { status: options.email === false ? 503 : 200 },
      );
    if (url.includes("crm.example.com"))
      return new Response(null, { status: options.crm === false ? 500 : 200 });
    throw new Error("Unexpected network call in test");
  });
}
beforeEach(() => {
  state.deferred.length = 0;
  state.expiry.clear();
  state.records.clear();
  state.pending.clear();
  state.allowed = true;
  state.capture.mockClear();
  for (const [key, value] of Object.entries({
    NEXT_PUBLIC_CONTACT_ENABLED: "true",
    RESEND_API_KEY: "test-only",
    CONTACT_FROM_EMAIL: "test@example.com",
    CONTACT_TO_EMAIL: "test@example.com",
    TURNSTILE_SECRET: "test-only",
    TURNSTILE_ALLOWED_HOSTNAMES: "venizor.com",
    UPSTASH_REDIS_REST_URL: "https://redis.example.com",
    UPSTASH_REDIS_REST_TOKEN: "test-only",
    CRM_WEBHOOK_URL: "",
    CRM_TEST_WEBHOOK_URL: "",
    SYNTHETIC_CONTACT_SECRET: "",
    CONTACT_TEST_TO_EMAIL: "",
  }))
    vi.stubEnv(key, value);
});

describe("contact validation and safety", () => {
  it("rejects malformed JSON, short messages and invalid email addresses", async () => {
    expect(
      (
        await POST(
          new Request("https://venizor.com/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{",
          }),
        )
      ).status,
    ).toBe(400);
    expect((await POST(request({ email: "invalid" }))).status).toBe(400);
    expect((await POST(request({ message: "short" }))).status).toBe(400);
  });
  it("rejects oversized and unsupported payloads", async () => {
    expect((await POST(request({ message: "a".repeat(70000) }))).status).toBe(
      413,
    );
    expect(
      (await POST(request({}, { "Content-Type": "text/plain" }))).status,
    ).toBe(415);
  });
  it("drops honeypot submissions without sending or storing a lead", async () => {
    const fetch = provider();
    expect((await POST(request({ company_website: "spam.test" }))).status).toBe(
      200,
    );
    expect(fetch).not.toHaveBeenCalled();
    expect(state.records.size).toBe(0);
  });
  it("does not report success while delivery is disabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_CONTACT_ENABLED", "false");
    const fetch = provider();
    expect((await POST(request())).status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("blocks cross-origin requests and unauthorized synthetic tests", async () => {
    expect(
      (await POST(request({}, { Origin: "https://other.example" }))).status,
    ).toBe(403);
    expect((await POST(request({ test: true }))).status).toBe(403);
  });
  it("enforces rate limits with a Retry-After response", async () => {
    state.allowed = false;
    const fetch = provider();
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects invalid Turnstile tokens and unexpected hostnames", async () => {
    provider({ turnstile: false });
    expect((await POST(request())).status).toBe(400);
    vi.restoreAllMocks();
    provider({ hostname: "attacker.example" });
    expect((await POST(request())).status).toBe(400);
    expect(state.pending.size).toBe(0);
  });
});

describe("lead delivery and recovery", () => {
  it("acknowledges provider acceptance and deduplicates a retried request", async () => {
    const fetch = provider();
    expect((await POST(request())).status).toBe(200);
    expect((await POST(request())).status).toBe(200);
    expect(
      fetch.mock.calls.filter(([url]) =>
        String(url).includes("api.resend.com"),
      ),
    ).toHaveLength(1);
    expect(state.records.has(`venizor:lead:receipt:${id}`)).toBe(true);
    expect(state.records.has(`venizor:lead:${id}`)).toBe(false);
    expect(state.pending.size).toBe(0);
  });
  it("keeps the lead queued and reports an error when email fails", async () => {
    provider({ email: false });
    expect((await POST(request())).status).toBe(503);
    expect(state.pending.has(id)).toBe(true);
    const saved = state.records.get(`venizor:lead:${id}`) as {
      lead: Record<string, unknown>;
    };
    expect(saved.lead).not.toHaveProperty("token");
    expect(saved.lead).not.toHaveProperty("company_website");
  });
  it("does not accept an email response without a provider receipt", async () => {
    provider({ missingEmailId: true });
    expect((await POST(request())).status).toBe(503);
  });
  it("preserves a successful form response during CRM failure, then retries without resending email", async () => {
    vi.stubEnv("CRM_WEBHOOK_URL", "https://crm.example.com/leads");
    const fetch = provider({ crm: false });
    expect((await POST(request())).status).toBe(200);
    expect(state.pending.has(id)).toBe(true);
    expect(
      fetch.mock.calls.filter(([url]) =>
        String(url).includes("crm.example.com"),
      ),
    ).toHaveLength(0);
    await state.deferred.shift()?.();
    fetch.mockRestore();
    const recovered = provider();
    expect(await deliverLead(id)).toMatchObject({ emailed: true, crm: true });
    expect(
      recovered.mock.calls.filter(([url]) =>
        String(url).includes("api.resend.com"),
      ),
    ).toHaveLength(0);
    expect(state.pending.has(id)).toBe(false);
  });
  it("sends a requested report copy once without subscribing the visitor", async () => {
    const fetch = provider();
    expect(
      (
        await POST(
          request({
            source: "scope",
            report: "An indicative planning report.",
            sendReport: true,
          }),
        )
      ).status,
    ).toBe(200);
    await state.deferred.shift()?.();
    await POST(
      request({
        source: "scope",
        report: "An indicative planning report.",
        sendReport: true,
      }),
    );
    const emails = fetch.mock.calls.filter(([url]) =>
      String(url).includes("api.resend.com"),
    );
    expect(emails).toHaveLength(2);
    expect(JSON.parse(String(emails[1][1]?.body)).text).toContain(
      "No marketing subscription",
    );
  });
  it("does not send a tool report when the visitor did not request it", async () => {
    const fetch = provider();
    await POST(
      request({ source: "scope", report: "Example report", sendReport: false }),
    );
    expect(
      fetch.mock.calls.filter(([url]) =>
        String(url).includes("api.resend.com"),
      ),
    ).toHaveLength(1);
  });
  it("does not send twice while another worker holds a delivery lock", async () => {
    state.records.set(`venizor:lead:lock:${id}`, "another-worker");
    const fetch = provider();
    expect((await POST(request())).status).toBe(409);
    expect(
      fetch.mock.calls.filter(([url]) =>
        String(url).includes("api.resend.com"),
      ),
    ).toHaveLength(0);
  });
  it("stops ambiguous email retries before the provider idempotency window ends", async () => {
    provider({ email: false });
    await POST(request());
    const record = state.records.get(`venizor:lead:${id}`) as {
      createdAt: number;
    };
    record.createdAt = Date.now() - 24 * 60 * 60 * 1000;
    state.records.set(`venizor:lead:${id}`, record);
    vi.restoreAllMocks();
    const fetch = provider();
    expect(await deliverLead(id)).toMatchObject({ emailed: false });
    expect(fetch).not.toHaveBeenCalled();
    expect(state.pending.has(id)).toBe(false);
    expect(state.capture).toHaveBeenCalled();
  });
  it("preserves the original retention deadline across CRM retries", async () => {
    vi.stubEnv("CRM_WEBHOOK_URL", "https://crm.example.com/leads");
    provider({ crm: false });
    await POST(request());
    const record = state.records.get(`venizor:lead:${id}`) as {
      createdAt: number;
    };
    record.createdAt = Date.now() - 2 * 24 * 60 * 60 * 1000;
    state.records.set(`venizor:lead:${id}`, record);
    await deliverLead(id);
    expect(state.expiry.get(`venizor:lead:${id}`)).toBeLessThanOrEqual(
      5 * 24 * 60 * 60,
    );
  });
});
