"use client";

import { CookiePreferences } from "./cookie-preferences";
import { OptionalFeatureBoundary } from "./optional-feature-boundary";
import { captureAttribution } from "@/lib/contact";
import {
  googleAnalyticsId,
  hasAnalyticsConsent,
  parseConsent,
  vercelAnalyticsEnabled,
} from "@/lib/cookie-consent";
import { useCookieConsent } from "@/lib/use-cookie-consent";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { useEffect } from "react";

function prepareGoogleAnalytics() {
  if (!hasAnalyticsConsent()) return;
  window.dataLayer ||= [];
  window.gtag ||= function () {
    // eslint-disable-next-line prefer-rest-params -- Preserve Google's documented gtag command queue format.
    window.dataLayer?.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", googleAnalyticsId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

export function SiteAnalytics() {
  const raw = useCookieConsent();
  const allowed =
    parseConsent(raw)?.analytics === true && hasAnalyticsConsent();
  useEffect(() => {
    if (allowed) captureAttribution();
  }, [allowed]);
  return (
    <>
      <CookiePreferences raw={raw} />
      {allowed && (
        <OptionalFeatureBoundary feature="optional-analytics">
          {googleAnalyticsId && (
            <Script
              id="venizor-google-analytics"
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
              onReady={prepareGoogleAnalytics}
            />
          )}
          {vercelAnalyticsEnabled && (
            <>
              <Analytics
                beforeSend={(event) => (hasAnalyticsConsent() ? event : null)}
              />
              <SpeedInsights
                beforeSend={(event) => (hasAnalyticsConsent() ? event : null)}
              />
            </>
          )}
        </OptionalFeatureBoundary>
      )}
    </>
  );
}
