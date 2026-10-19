import { SiteAnalytics } from "@/components/site-analytics";
import { SmoothMotion } from "@/components/smooth-motion";
import { OptionalFeatureBoundary } from "@/components/optional-feature-boundary";
import { pageMetadata } from "@/lib/metadata";
import { isIndexable, site } from "@/lib/site";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "./globals.css";
import "./motion.css";
import "./pages.css";
import "./production.css";
import "./design-system.css";
import "lenis/dist/lenis.css";
import "./smooth-motion.css";
import "./recovery.css";
import "./cookie-preferences.css";
import "./site-search.css";
import "./section-art.css";
import "./scenario-visual.css";
import "./tools/tools.css";
import "./refinements.css";

import { GlobalJsonLd } from "@/components/json-ld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...pageMetadata("/"),
  metadataBase: new URL(site.url),
  title: {
    default: "Software, Web & AI Development Studio | VENIZOR",
    template: "%s | VENIZOR",
  },
  robots: {
    index: isIndexable,
    follow: isIndexable,
    googleBot: {
      index: isIndexable,
      follow: isIndexable,
      "max-image-preview": "large",
    },
  },
  formatDetection: { email: false, address: false, telephone: false },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : {},
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <GlobalJsonLd />
        <OptionalFeatureBoundary feature="smooth-scrolling">
          <SmoothMotion />
        </OptionalFeatureBoundary>
        {children}
        <OptionalFeatureBoundary feature="analytics">
          <SiteAnalytics />
        </OptionalFeatureBoundary>
      </body>
    </html>
  );
}
