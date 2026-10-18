import type { Metadata } from "next";
import { routeInfo, site } from "./site";

export function pageMetadata(
  path: string,
  title?: string,
  description?: string,
): Metadata {
  const info = routeInfo[path];
  const heading = title || info?.title || "VENIZOR Studio";
  const fullSummary =
    description || info?.description || routeInfo["/"].description;
  const concise =
    heading.length > 50 && heading.includes(":")
      ? heading.split(":")[0]
      : heading;
  const seoTitle =
    concise.length > 50
      ? concise.slice(0, 49).replace(/\s+\S*$/, "") + "…"
      : concise;
  const summary =
    fullSummary.length > 160
      ? fullSummary.slice(0, 159).replace(/\s+\S*$/, "") + "…"
      : fullSummary;
  const image = `${site.url}/og?path=${encodeURIComponent(path)}`;
  return {
    title: seoTitle,
    description: summary,
    alternates: { canonical: path },
    openGraph: {
      title: `${heading} | VENIZOR`,
      description: summary,
      url: path,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: heading }],
    },
    twitter: {
      card: "summary_large_image",
      title: heading,
      description: summary,
      images: [image],
    },
  };
}
