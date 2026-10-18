import { leadSchema } from "@/lib/contact";
import {
  deliverLead,
  deliveryReady,
  leadLimiter,
  leadStore,
  saveLead,
} from "@/lib/lead-delivery";
import { site } from "@/lib/site";
import * as Sentry from "@sentry/nextjs";
import { createHash, timingSafeEqual } from "node:crypto";
import { after } from "next/server";

export const maxDuration = 30;
async function readBody(request: Request) {
  const limit = 64 * 1024;
  if (Number(request.headers.get("content-length")) > limit)
    throw new RangeError("Payload too large");
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) {
        await reader.cancel();
        throw new RangeError("Payload too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString("utf8");
}
function authorizedTest(request: Request) {
  const expected = process.env.SYNTHETIC_CONTACT_SECRET || "";
  const received = request.headers.get("x-synthetic-secret") || "";
  return Boolean(
    expected &&
    Buffer.byteLength(received) === Buffer.byteLength(expected) &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(received)),
  );
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    origin &&
    origin !== new URL(request.url).origin &&
    origin !== new URL(site.url).origin
  )
    return Response.json(
      { error: "Request origin is not allowed." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json({ error: "Send a JSON request." }, { status: 415 });
  try {
    const raw = await readBody(request);
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }
    if (
      body &&
      typeof body === "object" &&
      "company_website" in body &&
      body.company_website
    )
      return Response.json({ ok: true });
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success)
      return Response.json(
        {
          error:
            "Check your name, email, project type and message (at least 10 characters).",
        },
        { status: 400 },
      );
    const lead = parsed.data;
    if (!deliveryReady())
      return Response.json(
        {
          error:
            "Online delivery is not available yet. Please email info@venizor.com directly.",
        },
        { status: 503 },
      );
    const synthetic = lead.test && authorizedTest(request);
    if (lead.test && (!synthetic || !process.env.CONTACT_TEST_TO_EMAIL))
      return Response.json(
        { error: "Test request is not authorized." },
        { status: 403 },
      );
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const ipHash = createHash("sha256")
      .update(ip + process.env.TURNSTILE_SECRET)
      .digest("hex");
    const limit = await leadLimiter().limit(ipHash);
    if (!limit.success)
      return Response.json(
        { error: "Too many requests. Please try again later or email us." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000)),
            ),
          },
        },
      );
    const receipt = await leadStore().get(
      `venizor:lead:receipt:${lead.requestId}`,
    );
    if (receipt) return Response.json({ ok: true, reference: lead.requestId });
    if (!synthetic) {
      if (!lead.token)
        return Response.json(
          { error: "Please complete the security check." },
          { status: 400 },
        );
      const validation = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: new URLSearchParams({
            secret: process.env.TURNSTILE_SECRET!,
            response: lead.token,
            remoteip: ip,
            idempotency_key: crypto.randomUUID(),
          }),
          signal: AbortSignal.timeout(5000),
        },
      );
      const result = (await validation.json()) as {
        success?: boolean;
        hostname?: string;
        action?: string;
      };
      const hosts = (
        process.env.TURNSTILE_ALLOWED_HOSTNAMES || new URL(site.url).hostname
      )
        .split(",")
        .map((value) => value.trim());
      if (
        !validation.ok ||
        !result.success ||
        result.action !== "contact" ||
        !result.hostname ||
        !hosts.includes(result.hostname)
      )
        return Response.json(
          { error: "Security check expired or failed. Please try again." },
          { status: 400 },
        );
    }
    await saveLead(lead);
    const result = await deliverLead(lead.requestId, { primaryOnly: true });
    if (result.busy)
      return Response.json(
        {
          error: "Your request is being processed. Please retry in a moment.",
          reference: lead.requestId,
        },
        { status: 409 },
      );
    if (!result.emailed)
      return Response.json(
        {
          error:
            "Delivery is delayed. Your reference is saved; please retry or email us if urgent.",
          reference: lead.requestId,
        },
        { status: 503 },
      );
    if (!result.crm)
      after(async () => {
        await deliverLead(lead.requestId);
      });
    return Response.json({ ok: true, reference: lead.requestId });
  } catch (error) {
    if (error instanceof RangeError)
      return Response.json(
        { error: "Your message is too large." },
        { status: 413 },
      );
    Sentry.captureException(error);
    return Response.json(
      {
        error:
          "We could not confirm delivery. Please retry or email info@venizor.com.",
      },
      { status: 503 },
    );
  }
}
