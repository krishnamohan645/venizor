"use client";

import { Cookie, LockKeyhole, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  googleAnalyticsId,
  openCookieSettings,
  optionalAnalyticsAvailable,
  parseConsent,
  PREFERENCES_EVENT,
  saveConsent,
  consentSnapshot,
  vercelAnalyticsEnabled,
} from "@/lib/cookie-consent";

const subscribeHydration = () => () => {};

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="legal-link cookie-settings-link"
      onClick={openCookieSettings}
    >
      Cookie settings
    </button>
  );
}

export function CookiePreferences({ raw }: { raw: string | null }) {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [feedback, setFeedback] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showBanner = hydrated && optionalAnalyticsAvailable && raw === null;
  function customize() {
    setAnalytics(parseConsent(consentSnapshot())?.analytics ?? false);
    setOpen(true);
  }
  useEffect(() => {
    const show = () => {
      setAnalytics(parseConsent(consentSnapshot())?.analytics ?? false);
      setOpen(true);
    };
    window.addEventListener(PREFERENCES_EVENT, show);
    return () => {
      window.removeEventListener(PREFERENCES_EVENT, show);
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    heading.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);
  function close() {
    dialog.current?.close();
    setOpen(false);
  }
  function choose(allow: boolean) {
    const persistent = saveConsent(allow);
    setFeedback(
      persistent
        ? "Your privacy choices are saved. Change them anytime in Cookie settings."
        : "Your choice applies in this tab. Your browser prevented saving it for future visits.",
    );
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(""), 6500);
    close();
  }
  return (
    <>
      {showBanner && !open && (
        <section
          className="cookie-banner"
          aria-labelledby="cookie-banner-title"
        >
          <div className="cookie-banner-heading">
            <span className="cookie-symbol">
              <Cookie size={21} strokeWidth={1.6} />
            </span>
            <span className="cookie-eyebrow">A LITTLE ABOUT YOUR PRIVACY</span>
          </div>
          <h2 id="cookie-banner-title">Your visit. Your choice.</h2>
          <p>
            Necessary storage keeps the site working. With your permission,
            optional analytics helps us understand what’s useful.{" "}
            <Link href="/privacy">Read our privacy notice.</Link>
          </p>
          <div className="cookie-banner-actions">
            <button type="button" onClick={() => choose(false)}>
              Necessary only
            </button>
            <button type="button" onClick={() => choose(true)}>
              Accept all
            </button>
          </div>
          <button
            type="button"
            className="cookie-customize"
            onClick={customize}
          >
            <SlidersHorizontal size={14} /> Customize choices
          </button>
        </section>
      )}
      {open && (
        <dialog
          ref={dialog}
          className="site-dialog cookie-dialog"
          aria-labelledby="cookie-dialog-title"
          aria-describedby="cookie-dialog-description"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              const rect = event.currentTarget.getBoundingClientRect();
              if (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
              )
                close();
            }
          }}
        >
          <button
            type="button"
            className="dialog-close icon-button"
            aria-label="Close cookie settings"
            onClick={close}
          >
            <X size={19} />
          </button>
          <div className="cookie-dialog-kicker">
            <Cookie size={19} />
            <span className="cookie-eyebrow">PRIVACY, ON YOUR TERMS</span>
          </div>
          <h2 ref={heading} id="cookie-dialog-title" tabIndex={-1}>
            Cookie preferences.
          </h2>
          <p id="cookie-dialog-description">
            Choose what this browser remembers. Optional analytics stays off
            until you allow it, and you can change your mind anytime.
          </p>
          <div className="cookie-category">
            <div className="cookie-category-top">
              <div>
                <LockKeyhole size={16} />
                <h3>Necessary</h3>
              </div>
              <span className="cookie-always-active">Always active</span>
            </div>
            <p>
              Remembers your privacy choice and supports basic site features.
              Reading preferences are saved when you ask us to remember them.
            </p>
            <span className="cookie-category-detail">
              Stored on your device
            </span>
          </div>
          <div className="cookie-category">
            <div className="cookie-category-top">
              <h3>Analytics</h3>
              <label className="cookie-switch">
                <input
                  type="checkbox"
                  role="switch"
                  aria-label="Allow optional analytics"
                  checked={analytics}
                  disabled={!optionalAnalyticsAvailable}
                  onChange={(event) => setAnalytics(event.target.checked)}
                />
                <span aria-hidden="true" />
              </label>
            </div>
            <p>
              {optionalAnalyticsAvailable
                ? "Helps us understand page visits and site performance. It is never required to browse or contact us."
                : "Optional analytics is currently off for this site. No analytics services will load from this choice."}
            </p>
            <span className="cookie-category-detail">
              {[
                googleAnalyticsId && "Google Analytics",
                vercelAnalyticsEnabled && "Vercel Analytics & Speed Insights",
              ]
                .filter(Boolean)
                .join(" · ") || "No optional analytics active"}
            </span>
          </div>
          <p className="cookie-storage-note">
            We remember your choice for up to six months.{" "}
            <Link href="/privacy">
              Privacy notice <span aria-hidden="true">↗</span>
            </Link>
          </p>
          <div className="cookie-dialog-actions">
            <button type="button" onClick={() => choose(false)}>
              Reject optional
            </button>
            <button type="button" onClick={() => choose(analytics)}>
              Save preferences
            </button>
          </div>
        </dialog>
      )}
      <div className={feedback ? "cookie-feedback" : "sr-only"} role="status">
        {feedback}
      </div>
    </>
  );
}
