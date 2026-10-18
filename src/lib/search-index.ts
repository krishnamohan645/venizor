import "server-only";
import { blogPosts } from "@/data/blog-data";
import { scenarios } from "@/data/scenarios";
import { services } from "@/data/services";
import { routeInfo } from "@/lib/site";
import type { SearchEntry } from "@/lib/search";

const pageKeywords: Record<string, string> = {
  "/about": "studio who we are team culture",
  "/blog": "blog insights articles field notes",
  "/case-studies": scenarios
    .map(
      (item) =>
        `${item.name} ${item.industry} ${item.summary} ${item.stack.join(" ")}`,
    )
    .join(" "),
  "/contact": "contact us email enquiry consultation project brief",
  "/playbook": "stack architecture technology planning framework comparison",
  "/scope": "project scoping wizard estimate brief planning",
  "/tools":
    "webhook signature idempotency LLM cost calculator security headers generator utilities",
  "/careers": "jobs hiring opportunities culture work with us",
  "/privacy": "cookies consent preferences analytics personal data",
};

const homeSections = [
  [
    "products",
    "Products",
    "Explore the studio's product concepts and software tools.",
  ],
  [
    "services",
    "Services overview",
    "Explore the studio's design and engineering capabilities.",
  ],
  [
    "industries",
    "Industries",
    "Technology for finance, healthcare, retail, education and more.",
  ],
  [
    "work",
    "Our work",
    "Explore illustrative projects and architecture approaches.",
  ],
  [
    "about",
    "About the studio",
    "An independent studio connecting strategy, design and technology.",
  ],
  [
    "process",
    "Our process",
    "How we discover, design, build and launch software together.",
  ],
  [
    "insights",
    "Latest insights",
    "Recent thinking and field notes from VENIZOR.",
  ],
];

/** Derived from the same records used by the sitemap and public pages. */
export function getSearchIndex(): SearchEntry[] {
  return [
    ...Object.entries(routeInfo).map(([href, page]) => ({
      href,
      title: href === "/blog" ? "Blog & field notes" : page.label,
      description: page.description,
      kind: "Page" as const,
      keywords: `${page.title} ${pageKeywords[href] || ""}`,
    })),
    ...services.map((service) => ({
      href: `/services/${service.slug}`,
      title: service.name,
      description: service.intro,
      kind: "Service" as const,
      keywords: [
        service.audience,
        ...service.deliverables,
        ...service.technologies,
      ].join(" "),
    })),
    ...blogPosts.map((post) => ({
      href: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      kind: "Article" as const,
      keywords: [
        post.category,
        ...(post.architectureBadges || []),
        ...post.keyTakeaways,
        ...post.content.map((section) => section.sectionHeading),
      ].join(" "),
    })),
    ...homeSections.map(([id, title, description]) => ({
      href: `/#${id}`,
      title,
      description,
      kind: "Home section" as const,
      keywords: "homepage",
    })),
  ];
}
