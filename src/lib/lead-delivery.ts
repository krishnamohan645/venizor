import * as Sentry from "@sentry/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import "server-only";
import type { Lead } from "./contact";

export function deliveryReady() {
  return (
    process.env.NEXT_PUBLIC_CONTACT_ENABLED === "true" &&
    Boolean(
      process.env.RESEND_API_KEY &&
      process.env.CONTACT_FROM_EMAIL &&
      process.env.CONTACT_TO_EMAIL &&
      process.env.TURNSTILE_SECRET &&
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN,
    )
  );
}
export function leadStore() {
  return Redis.fromEnv();
}
export function leadLimiter() {
  return new Ratelimit({
    redis: leadStore(),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "venizor:contact:rate",
    analytics: false,
  });
}

type StoredLead = {
  lead: Omit<Lead, "token" | "company_website">;
  emailId?: string;
  reportEmailId?: string;
  crmDone: boolean;
  attempts: number;
  createdAt: number;
};
const ttl = 60 * 60 * 24 * 7;

export async function saveLead(lead: Lead) {
  const { token: _token, company_website: _honeypot, ...safe } = lead;
  void _token;
  void _honeypot;
  const redis = leadStore();
  const key = `venizor:lead:${lead.requestId}`;
  const saved = await redis.set(
    key,
    {
      lead: safe,
      crmDone: false,
      attempts: 0,
      createdAt: Date.now(),
    } satisfies StoredLead,
    { nx: true, ex: ttl },
  );
  // Existing pending records are safe to re-enqueue; successful ones are checked by deliverLead.
  await redis.zadd("venizor:lead:pending", {
    score: Date.now(),
    member: lead.requestId,
  });
  return Boolean(saved);
}

export async function deliverLead(
  id: string,
  options: { primaryOnly?: boolean } = {},
): Promise<{ emailed: boolean; crm: boolean; busy?: boolean }> {
  const redis = leadStore();
  const lockKey = `venizor:lead:lock:${id}`;
  const lockId = crypto.randomUUID();
  if (!(await redis.set(lockKey, lockId, { nx: true, ex: 60 })))
    return { emailed: false, crm: false, busy: true };
  try {
    const record = await redis.get<StoredLead>(`venizor:lead:${id}`);
    if (!record) {
      await redis.zrem("venizor:lead:pending", id);
      return { emailed: false, crm: false };
    }
    const remainingTtl = Math.ceil(
      (record.createdAt + ttl * 1000 - Date.now()) / 1000,
    );
    if (remainingTtl <= 0) {
      await redis.del(`venizor:lead:${id}`);
      await redis.zrem("venizor:lead:pending", id);
      Sentry.captureMessage(
        "Pending lead expired; review delivery monitoring",
        { level: "error", extra: { leadId: id } },
      );
      return { emailed: Boolean(record.emailId), crm: false };
    }
    const pendingEmail =
      !record.emailId ||
      (record.lead.sendReport &&
        record.lead.report &&
        !record.reportEmailId &&
        ["scope", "simulator"].includes(record.lead.source));
    if (pendingEmail && Date.now() - record.createdAt > 23 * 60 * 60 * 1000) {
      // Resend idempotency retention is 24h. Stop ambiguous retries before that window ends.
      Sentry.captureMessage("Lead delivery requires manual review", {
        level: "error",
        extra: { leadId: id },
      });
      await redis.zrem("venizor:lead:pending", id);
      return { emailed: Boolean(record.emailId), crm: false };
    }
    record.attempts += 1;
    await redis.set(`venizor:lead:${id}`, record, { ex: remainingTtl });
    if (!record.emailId) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `venizor-lead-${id}`,
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL,
          to: record.lead.test
            ? process.env.CONTACT_TEST_TO_EMAIL
            : process.env.CONTACT_TO_EMAIL,
          reply_to: record.lead.email,
          subject: `${record.lead.test ? "[SYNTHETIC TEST] " : ""}Project enquiry: ${record.lead.service.replace(/[\r\n]/g, " ")}`,
          text: `Reference: ${id}\nName: ${record.lead.name}\nEmail: ${record.lead.email}\nService: ${record.lead.service}\nSource: ${record.lead.source}\n\n${record.lead.message}\n\nAttribution: ${JSON.stringify(record.lead.attribution || {})}`,
        }),
        signal: AbortSignal.timeout(10000),
      });
      const result = (await response.json()) as { id?: string };
      if (!response.ok || !result.id)
        throw new Error(`Email provider rejected lead (${response.status})`);
      record.emailId = result.id;
      await redis.set(`venizor:lead:${id}`, record, { ex: remainingTtl });
    }
    const webhook = record.lead.test
      ? process.env.CRM_TEST_WEBHOOK_URL
      : process.env.CRM_WEBHOOK_URL;
    const needsReport =
      record.lead.sendReport &&
      record.lead.report &&
      !record.reportEmailId &&
      ["scope", "simulator"].includes(record.lead.source);
    if (options.primaryOnly && (needsReport || (webhook && !record.crmDone))) {
      await redis.zadd("venizor:lead:pending", {
        score: Date.now(),
        member: id,
      });
      return { emailed: true, crm: false };
    }
    if (
      record.lead.sendReport &&
      record.lead.report &&
      !record.reportEmailId &&
      ["scope", "simulator"].includes(record.lead.source)
    ) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `venizor-report-${id}`,
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL,
          to: record.lead.test
            ? process.env.CONTACT_TEST_TO_EMAIL
            : record.lead.email,
          subject: "Your requested VENIZOR planning report",
          text: `Here is the report you requested from VENIZOR.\n\n${record.lead.report}\n\nThis is an illustrative planning aid, not a quote or measured production benchmark.\nReference: ${id}\n\nYou received this one-time email because you requested a copy. No marketing subscription was created.`,
        }),
        signal: AbortSignal.timeout(8000),
      });
      const result = (await response.json()) as { id?: string };
      if (!response.ok || !result.id)
        throw new Error(`Report email rejected (${response.status})`);
      record.reportEmailId = result.id;
      await redis.set(`venizor:lead:${id}`, record, { ex: remainingTtl });
    }
    if (webhook && !record.crmDone) {
      const response = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": id,
          ...(process.env.CRM_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({ ...record.lead, emailId: record.emailId }),
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) record.crmDone = true;
      else
        Sentry.captureMessage("CRM delivery failed", {
          level: "error",
          extra: { leadId: id, status: response.status },
        });
    } else if (!webhook) record.crmDone = true;
    await redis.set(`venizor:lead:${id}`, record, { ex: remainingTtl });
    if (record.crmDone) {
      await redis.zrem("venizor:lead:pending", id);
      // Email is the record. Keep only a deduplication receipt after complete delivery.
      await redis.set(
        `venizor:lead:receipt:${id}`,
        { emailId: record.emailId },
        { ex: ttl },
      );
      await redis.del(`venizor:lead:${id}`);
    } else
      await redis.zadd("venizor:lead:pending", {
        score: Date.now() + Math.min(record.attempts * 60000, 3600000),
        member: id,
      });
    return { emailed: true, crm: record.crmDone };
  } catch (error) {
    Sentry.captureException(error, { extra: { leadId: id } });
    await redis.zadd("venizor:lead:pending", {
      score: Date.now() + 60000,
      member: id,
    });
    // A CRM outage must not turn a delivered email into a failed form submission.
    const saved = await redis.get<StoredLead>(`venizor:lead:${id}`);
    return { emailed: Boolean(saved?.emailId), crm: false };
  } finally {
    // Do not release a lock acquired by another worker after expiry.
    await redis.eval(
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
      [lockKey],
      [lockId],
    );
  }
}
