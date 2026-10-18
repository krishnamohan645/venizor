import type { BlogPost } from "@/data/blog-data";
import { routeInfo, site } from "@/lib/site";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function GlobalJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": site.url + "/#organization",
            name: site.name,
            url: site.url,
            logo: site.url + "/logo-banner.jpeg",
            email: site.email,
            description:
              "Independent software and AI studio building websites, web applications, mobile apps and SaaS products.",
            ...(site.legalName ? { legalName: site.legalName } : {}),
            ...(site.city
              ? {
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: site.city,
                    addressCountry: "IN",
                  },
                }
              : {}),
          },
          {
            "@type": "WebSite",
            "@id": site.url + "/#website",
            name: site.name,
            url: site.url,
          },
        ],
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  path,
  label,
  parent,
}: {
  path: string;
  label?: string;
  parent?: { name: string; path: string };
}) {
  const items = [
    { name: "Home", path: "/" },
    ...(parent ? [parent] : []),
    ...(path === "/"
      ? []
      : [
          {
            name: label || routeInfo[path]?.label || path.split("/").pop(),
            path,
          },
        ]),
  ];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: site.url + item.path,
        })),
      }}
    />
  );
}

export function ArticleJsonLd({ post }: { post: BlogPost }) {
  return (
    <>
      <BreadcrumbJsonLd
        path={`/blog/${post.slug}`}
        label={post.title}
        parent={{ name: "Field notes", path: "/blog" }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: post.title,
          description: post.excerpt,
          datePublished: new Date(post.publishDate).toISOString(),
          dateModified: new Date(
            post.modifiedDate || post.publishDate,
          ).toISOString(),
          author: {
            "@type": "Organization",
            name: post.author.name,
            url: site.url + "/about",
          },
          publisher: { "@id": site.url + "/#organization" },
          mainEntityOfPage: site.url + `/blog/${post.slug}`,
          image: `${site.url}/og?path=${encodeURIComponent(`/blog/${post.slug}`)}`,
          articleSection: post.category,
        }}
      />
    </>
  );
}

export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }}
    />
  );
}
