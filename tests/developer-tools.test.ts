import { createHash, createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  signWebhook,
  estimateTokens,
  createSecurityHeaders,
} from "@/lib/developer-tools";

describe("developer utilities", () => {
  it("produces real HMAC-SHA256 signatures and exact-byte SHA-256 digests", async () => {
    const payload = '{"message":"hello 🌍"}',
      secret = "example_secret",
      time = "1729267200";
    const signed = await signWebhook(payload, secret, time);
    expect(signed.signature).toBe(
      `t=${time},v1=${createHmac("sha256", secret).update(`${time}.${payload}`).digest("hex")}`,
    );
    expect(signed.digest).toBe(
      createHash("sha256").update(payload).digest("hex"),
    );
    expect((await signWebhook(payload + " ", secret, time)).signature).not.toBe(
      signed.signature,
    );
  });
  it("rejects malformed payloads, missing secrets and invalid timestamps", async () => {
    await expect(signWebhook("{", "secret", "1")).rejects.toThrow(SyntaxError);
    await expect(signWebhook("{}", "", "1")).rejects.toThrow("signing secret");
    await expect(signWebhook("{}", "secret", "not-a-time")).rejects.toThrow(
      "timestamp",
    );
  });
  it("calculates input and output costs using editable rates and skipped calls", () => {
    const values = {
      queries: 1000000,
      input: 1000,
      output: 100,
      inputRate: 2,
      outputRate: 10,
      cache: 25,
    };
    expect(estimateTokens(values)).toEqual({
      calls: 750000,
      inputCost: 1500,
      outputCost: 750,
      total: 2250,
      saved: 750,
    });
    expect(estimateTokens({ ...values, cache: 100 }).total).toBe(0);
    expect(estimateTokens({ ...values, queries: 0 }).total).toBe(0);
  });
  it("exports only the selected optional headers and includes stable base policies", () => {
    const minimal = createSecurityHeaders({
      hsts: false,
      noSniff: false,
      frames: false,
      csp: false,
    });
    expect(minimal.map((header) => header.key)).toEqual([
      "Referrer-Policy",
      "Permissions-Policy",
    ]);
    const all = createSecurityHeaders({
      hsts: true,
      noSniff: true,
      frames: true,
      csp: true,
    });
    expect(all).toHaveLength(6);
    expect(
      all.find((header) => header.key === "Content-Security-Policy")?.value,
    ).toContain("object-src 'none'");
  });
});
