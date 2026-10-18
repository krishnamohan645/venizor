import { hasAnalyticsConsent } from "./cookie-consent";

type EventName =
  | "generate_lead"
  | "booking_click"
  | "booking_made"
  | "scope_wizard_complete"
  | "simulator_complete"
  | "whatsapp_click";
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
export function track(
  event: EventName,
  parameters: Record<string, string | number | boolean> = {},
) {
  try {
    if (!hasAnalyticsConsent()) return;
    window.gtag?.("event", event, parameters);
  } catch {
    /* Analytics must never interrupt a user action. */
  }
}
