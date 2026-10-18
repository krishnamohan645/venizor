import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Explicitly welcome Generative AI & Answer Engine Bots (AIO / GEO)
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "cohere-ai",
          "Bytespider",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://venizor.com/sitemap.xml",
  };
}
