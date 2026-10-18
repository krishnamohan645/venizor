import { z } from "zod";
import { hasAnalyticsConsent } from "./cookie-consent";

export const leadSchema = z.object({
  requestId: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  service: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(6000),
  company_website: z.string().max(200).optional().default(""),
  token: z.string().max(2048).optional().default(""),
  source: z
    .enum(["contact", "dialog", "scope", "simulator"])
    .default("contact"),
  attribution: z
    .object({
      landing: z.string().max(500).optional(),
      referrer: z.string().max(500).optional(),
      utm_source: z.string().max(100).optional(),
      utm_medium: z.string().max(100).optional(),
      utm_campaign: z.string().max(100).optional(),
    })
    .optional(),
  test: z.boolean().optional().default(false),
  report: z.string().max(6000).optional(),
  sendReport: z.boolean().optional().default(false),
});
export type Lead = z.infer<typeof leadSchema>;

export function captureAttribution() {
  if (!hasAnalyticsConsent()) return undefined;
  const key = "venizor-attribution";
  try {
    const stored = sessionStorage.getItem(key);
    if (stored) return JSON.parse(stored) as Lead["attribution"];
    const params = new URLSearchParams(location.search);
    const data = {
      landing: location.origin + location.pathname,
      referrer: document.referrer ? new URL(document.referrer).origin : "",
      utm_source: params.get("utm_source")?.slice(0, 100),
      utm_medium: params.get("utm_medium")?.slice(0, 100),
      utm_campaign: params.get("utm_campaign")?.slice(0, 100),
    };
    sessionStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch {
    return { landing: location.pathname };
  }
}
