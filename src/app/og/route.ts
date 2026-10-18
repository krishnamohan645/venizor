import { blogPosts } from "@/data/blog-data";
import { services } from "@/data/services";
import { routeInfo } from "@/lib/site";
import { ImageResponse } from "next/og";
import { createElement as h } from "react";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") || "/";
  const service = services.find((item) => `/services/${item.slug}` === path);
  const article = blogPosts.find((item) => `/blog/${item.slug}` === path);
  const title = service?.name || article?.title || routeInfo[path]?.title;
  if (!title) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    h(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f8fc",
          color: "#17191b",
          padding: "60px 72px",
          fontFamily: "sans-serif",
          borderTop: "12px solid #2048ff",
        },
      },
      h(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
          },
        },
        h(
          "span",
          { style: { fontWeight: 800, letterSpacing: "4px" } },
          "VENIZOR",
        ),
        h(
          "span",
          { style: { color: "#2048ff" } },
          article ? "FIELD NOTES" : "DESIGN + ENGINEERING",
        ),
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: title.length > 85 ? 52 : 66,
            lineHeight: 1.12,
            letterSpacing: "-2px",
            maxWidth: 1030,
            fontWeight: 700,
          },
        },
        title,
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#545d6b",
          },
        },
        h("span", {}, "Independent thinking. Connected possibilities."),
        h("span", {}, "venizor.com"),
      ),
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    },
  );
}
