import { blogPosts } from "@/data/blog-data";
import { services } from "@/data/services";
import { routeInfo, site } from "@/lib/site";
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(
    process.env.SITE_CONTENT_UPDATED_AT || "2026-10-18T00:00:00Z",
  );
  return [
    ...Object.keys(routeInfo).map((path) => ({
      url: site.url + (path === "/" ? "" : path),
      lastModified: updated,
    })),
    ...services.map((service) => ({
      url: `${site.url}/services/${service.slug}`,
      lastModified: updated,
    })),
    ...blogPosts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.modifiedDate || post.publishDate),
    })),
  ];
}
