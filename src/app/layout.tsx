import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./pages.css";
import "./motion.css";

import { GlobalJsonLd } from "@/components/json-ld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://venizor.com"),
  title: {
    default: "VENIZOR — Technology & Digital Innovation Studio",
    template: "%s | VENIZOR",
  },
  description:
    "We build products, engineer custom APIs, integrate third-party HTTPS services, deploy AI models, architect scalable databases, and automate cloud DevOps. Built with purpose by VENIZOR.",
  keywords: [
    "technology studio",
    "digital innovation",
    "API development",
    "HTTPS API integration",
    "AI integration",
    "custom LLM applications",
    "database architecture",
    "PostgreSQL",
    "cloud DevOps",
    "CI/CD automation",
    "application security",
    "digital marketing",
    "SXO",
    "India technology studio",
  ],
  authors: [{ name: "VENIZOR Studio", url: "https://venizor.com" }],
  creator: "VENIZOR Studio",
  publisher: "VENIZOR Studio",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "VENIZOR — Ideas. Technology. Real impact.",
    description:
      "We build products, engineer solutions, and automate what’s next. SaaS, AI, custom APIs, and digital growth.",
    url: "https://venizor.com",
    siteName: "VENIZOR",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VENIZOR — Technology & Digital Innovation Studio",
    description:
      "Building purposeful digital products, custom APIs, AI pipelines, and cloud DevOps.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <GlobalJsonLd />
        {children}
      </body>
    </html>
  );
}
