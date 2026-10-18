import type { BlogPost } from "@/data/blog-data";

export function GlobalJsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VENIZOR",
    legalName: "VENIZOR Digital Studio",
    url: "https://venizor.com",
    logo: "https://venizor.com/logo-banner.jpeg",
    description:
      "Independent technology and digital innovation studio specializing in product design, custom REST/GraphQL APIs, third-party HTTPS integrations, AI application pipelines, database architecture, cloud DevOps, security hardening, and digital marketing.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Product Design & Design Systems",
      "REST, GraphQL & WebSocket API Architecture",
      "Third-Party HTTPS API Integrations & Webhooks",
      "Artificial Intelligence & Large Language Model (LLM) Integration",
      "Retrieval-Augmented Generation (RAG) & Vector Databases",
      "PostgreSQL, Redis & Scalable Database Engineering",
      "Cloud DevOps, Docker, Kubernetes & CI/CD Pipelines",
      "Production Deployment, Zero-Downtime Maintenance & Telemetry",
      "Application Security, OWASP Hardening & Encryption",
      "Digital Marketing, Technical SEO, AEO & Conversion Rate Optimization (SXO)",
    ],
    sameAs: [
      "https://github.com/venizor",
      "https://linkedin.com/company/venizor",
      "https://x.com/venizor",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VENIZOR",
    url: "https://venizor.com",
    description: "Ideas. Technology. Real impact.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://venizor.com/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "VENIZOR Technology & Digital Innovation Studio",
    url: "https://venizor.com",
    priceRange: "$$$",
    telephone: "+91",
    areaServed: [
      "Worldwide",
      "United States",
      "United Kingdom",
      "Europe",
      "India",
      "Asia-Pacific",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
    </>
  );
}

export function ArticleJsonLd({ post }: { post: BlogPost }) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.publishDate).toISOString(),
    dateModified: new Date(post.publishDate).toISOString(),
    author: {
      "@type": "Organization",
      name: post.author.name,
      url: "https://venizor.com",
    },
    publisher: {
      "@type": "Organization",
      name: "VENIZOR",
      logo: {
        "@type": "ImageObject",
        url: "https://venizor.com/logo-banner.jpeg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://venizor.com/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.keyTakeaways.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
