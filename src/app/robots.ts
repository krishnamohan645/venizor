import { isIndexable, site } from "@/lib/site";
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isIndexable
      ? [
          { userAgent: "*", allow: "/", disallow: ["/api/"] },
          {
            userAgent: [
              "GPTBot",
              "OAI-SearchBot",
              "ChatGPT-User",
              "ClaudeBot",
              "PerplexityBot",
              "Google-Extended",
            ],
            allow: "/",
            disallow: ["/api/"],
          },
        ]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
