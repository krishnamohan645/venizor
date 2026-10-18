"use client";
import { captureAttribution } from "@/lib/contact";
import { track } from "@/lib/track";
import { ArrowUpRight, Check, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
const enabled = process.env.NEXT_PUBLIC_CONTACT_ENABLED === "true";
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const projectTypes = [
  "A new project",
  "Website development",
  "Web application",
  "Mobile app",
  "AI & automation",
  "SaaS product",
  "Digital marketing",
  "SEO & AEO",
  "A consultation",
];

export function LeadForm({
  source = "contact",
  initialMessage = "",
  compact = false,
  report,
}: {
  source?: "contact" | "dialog" | "scope" | "simulator";
  initialMessage?: string;
  compact?: boolean;
  report?: string;
}) {
  const id = useId();
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const requestId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const [reference, setReference] = useState("");
  const formVisible = status !== "success";
  useEffect(() => {
    captureAttribution();
  }, []);
  useEffect(() => {
    if (
      !formVisible ||
      !enabled ||
      !siteKey ||
      !scriptReady ||
      !window.turnstile ||
      !widget.current
    )
      return;
    widgetId.current = window.turnstile.render(widget.current, {
      sitekey: siteKey,
      action: "contact",
      theme: "light",
      callback: (value: string) => setToken(value),
      "expired-callback": () => setToken(""),
      "error-callback": () => {
        setToken("");
        setFeedback(
          "Security check could not load. Please retry or email us directly.",
        );
      },
    });
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [scriptReady, formVisible]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const service = String(data.get("service") || "");
    const message = String(data.get("message") || "").trim();
    if (!enabled) {
      window.location.href = `mailto:info@venizor.com?subject=${encodeURIComponent(`Project enquiry: ${service}`)}&body=${encodeURIComponent(`${message}\n\nName: ${name}\nEmail: ${email}\nProject type: ${service}`)}`;
      setFeedback(
        "Review and send this brief in your email app. Nothing has been submitted on this website.",
      );
      return;
    }
    if (!token) {
      setStatus("error");
      setFeedback("Please complete the security check before sending.");
      return;
    }
    setStatus("sending");
    setFeedback("");
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestId.current,
          name,
          email,
          service,
          message,
          company_website: data.get("company_website"),
          token,
          source,
          attribution: captureAttribution(),
          ...(report
            ? { report, sendReport: data.get("sendReport") === "on" }
            : {}),
        }),
        signal: AbortSignal.timeout(25000),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        reference?: string;
      };
      if (!response.ok || !result.ok || !result.reference)
        throw new Error(
          result.error ||
            "We could not confirm delivery. Please try again or email us directly.",
        );
      setReference(result.reference);
      setStatus("success");
      track("generate_lead", { source });
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Delivery could not be confirmed. Please try again.",
      );
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
      setToken("");
    }
  }
  if (status === "success")
    return (
      <div className="lead-success" role="status" tabIndex={-1}>
        <Check size={28} />
        <h3>Your enquiry is on its way.</h3>
        <p>
          Our email service has accepted your message. Keep this reference if
          you need to follow up.
        </p>
        <code>{reference}</code>
        <button
          className="text-link"
          type="button"
          onClick={() => {
            setStatus("idle");
            requestId.current = null;
            setToken("");
          }}
        >
          Send another enquiry <ArrowUpRight size={16} />
        </button>
      </div>
    );
  return (
    <form
      className={`lead-form ${compact ? "lead-form-compact" : ""}`}
      onSubmit={submit}
      onChange={() => {
        if (status !== "sending") {
          setStatus("idle");
          setFeedback("");
          requestId.current = null;
        }
      }}
    >
      <fieldset disabled={status === "sending"}>
        <div className="lead-form-row">
          <label htmlFor={`${id}-name`}>
            Your name
            <input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              placeholder="Your name"
            />
          </label>
          <label htmlFor={`${id}-email`}>
            Email address
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={200}
              placeholder="you@company.com"
            />
          </label>
        </div>
        <label htmlFor={`${id}-service`}>
          What would you like to work on?
          <select id={`${id}-service`} name="service">
            {projectTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label htmlFor={`${id}-message`}>
          A little about your project
          <textarea
            id={`${id}-message`}
            name="message"
            required
            minLength={10}
            maxLength={6000}
            rows={compact ? 3 : 5}
            defaultValue={initialMessage}
            placeholder="What do you want to build or improve?"
          />
        </label>
        <div className="lead-honeypot" aria-hidden="true">
          <label htmlFor={`${id}-website`}>
            Leave this field empty
            <input
              id={`${id}-website`}
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
        {enabled && siteKey && (
          <>
            <Script
              id="turnstile"
              src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
              strategy="lazyOnload"
              onReady={() => setScriptReady(true)}
              onError={() =>
                setFeedback(
                  "Security check is unavailable. Please email us directly.",
                )
              }
            />
            <div ref={widget} className="lead-security" />
          </>
        )}
        <p className="lead-privacy">
          By sending your brief, you ask us to respond to your enquiry.{" "}
          <Link href="/privacy">How we handle your information</Link>.
        </p>
        {report && enabled && (
          <label className="report-copy-option">
            <input type="checkbox" name="sendReport" />
            Email me a copy of this report, too.
          </label>
        )}
        <button
          type="submit"
          className="pill-button dark"
          disabled={status === "sending" || (enabled && !token)}
        >
          {status === "sending" ? (
            <>
              <LoaderCircle className="spin" size={16} />
              Sending…
            </>
          ) : enabled ? (
            <>
              Send your enquiry <ArrowUpRight size={17} />
            </>
          ) : (
            <>
              Email this brief <Mail size={17} />
            </>
          )}
        </button>
        {!enabled && (
          <p className="form-note">
            Online delivery will be available later. This opens your email app
            so you can review and send your brief directly.
          </p>
        )}
        <p
          className={`lead-feedback ${status === "error" ? "is-error" : ""}`}
          role={status === "error" ? "alert" : "status"}
        >
          {feedback}
        </p>
      </fieldset>
    </form>
  );
}
