"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Lock,
} from "lucide-react";
import { ExperienceProvider } from "@/components/experience";
import { CursorFollower } from "@/components/motion-details";
import { PageHeader, PageFooter } from "@/components/page-nav";

interface CaseStudy {
  id: string;
  client: string;
  industry: "FinTech" | "AI & Healthcare" | "Logistics & IoT" | "E-Commerce";
  headline: string;
  summary: string;
  challenge: string;
  solution: string;
  metrics: {
    label: string;
    value: string;
    detail: string;
  }[];
  stack: string[];
  quote: {
    text: string;
    author: string;
    role: string;
  };
}

const caseStudies: CaseStudy[] = [
  {
    id: "omniflow-fintech",
    client: "OmniFlow Global",
    industry: "FinTech",
    headline: "Scaling Mission-Critical Payment Mutations to 120,000 RPS with Zero Duplicate Charges",
    summary:
      "Engineered an enterprise financial payment gateway integrating Stripe and international banking APIs with cryptographic idempotency keys, sub-45ms latency, and high-concurrency connection pooling.",
    challenge:
      "During flash checkout surges, upstream payment providers threw intermittent 504 timeouts. Blind retries duplicated debit charges for thousands of customers, creating severe support backlogs and compliance risks.",
    solution:
      "Implemented SHA-256 cryptographic idempotency hashing stored in Redis prior to HTTP dispatch. Coupled with PgBouncer transaction pooling and BullMQ exponential jitter queues, duplicate charges dropped to mathematical zero.",
    metrics: [
      { label: "Duplicate Charges", value: "0", detail: "100% elimination of double-billing" },
      { label: "P99 Gateway Latency", value: "42ms", detail: "Down from 380ms prior to pooling" },
      { label: "Peak Concurrency", value: "120k RPS", detail: "Sustained during Black Friday sale" },
      { label: "Uptime Availability", value: "99.999%", detail: "Zero platform outages in 18 months" },
    ],
    stack: ["Next.js 16", "PostgreSQL", "PgBouncer", "Redis Cluster", "Stripe API", "Docker"],
    quote: {
      text: "VENIZOR’s idempotency architecture transformed our payments pipeline. We survived our largest traffic event in history with zero transaction anomalies.",
      author: "Marcus Vance",
      role: "VP of Engineering, OmniFlow",
    },
  },
  {
    id: "pulseai-diagnostics",
    client: "PulseAI Healthcare",
    industry: "AI & Healthcare",
    headline: "68% Reduction in AI Inference Costs via Native pgvector Hybrid Search & Model Routing",
    summary:
      "Architected a HIPAA-compliant clinical knowledge retrieval engine pairing pgvector embeddings with multi-tier semantic caching and cross-provider model fallbacks.",
    challenge:
      "Routine clinical document queries were routing directly to expensive frontier LLMs, driving OpenAI bills to $18,000/month while users experienced frustrating 1.8-second query latency.",
    solution:
      "Built a hybrid search layer (pgvector HNSW + BM25 keyword matching) colocated inside PostgreSQL. Added a Redis semantic cache that resolves 34% of repeated queries in 25ms, with an automated fallback router between Claude 3.5 and GPT-4o.",
    metrics: [
      { label: "API Cost Reduction", value: "-68%", detail: "Saved $12,400 monthly on token billing" },
      { label: "P95 Query Latency", value: "32ms", detail: "For semantic cache hits" },
      { label: "Retrieval Precision", value: "98.4%", detail: "Zero clinical schema hallucinations" },
      { label: "Data Compliance", value: "HIPAA / SOC2", detail: "Zero plain-text patient data storage" },
    ],
    stack: ["TypeScript Fastify", "PostgreSQL", "pgvector", "Redis Semantic Cache", "Claude 3.5", "OpenAI"],
    quote: {
      text: "The hybrid search precision is remarkable. VENIZOR didn’t just lower our AI bill by two-thirds; they made our diagnostic assistant feel instantaneous.",
      author: "Dr. Elena Rostova",
      role: "Chief Medical Information Officer",
    },
  },
  {
    id: "nexus-telematics",
    client: "Nexus Fleet Global",
    industry: "Logistics & IoT",
    headline: "Real-Time Telemetry Tracking for 40,000 Connected IoT Vehicles with 100% Zero-Downtime Deployments",
    summary:
      "Engineered an edge-routed WebSocket streaming system handling millions of concurrent GPS pings, paired with automated blue/green Docker release pipelines.",
    challenge:
      "Bi-weekly software deployments severed WebSocket connections to 40,000 active delivery vehicles, causing telemetry blind spots and delivery tracking errors.",
    solution:
      "Migrated socket routing to Cloudflare Workers with a Redis Pub/Sub cluster. Automated multi-stage distroless Docker deployments on AWS with automated traffic shifts, ensuring zero lost telemetry pings during live Friday releases.",
    metrics: [
      { label: "Active IoT Sockets", value: "40,000+", detail: "Simultaneously connected vehicles" },
      { label: "WebSocket Latency", value: "<15ms", detail: "Global packet delivery" },
      { label: "Deployment Downtime", value: "0 sec", detail: "Over 350 blue/green releases" },
      { label: "Container Footprint", value: "78MB", detail: "Distroless Docker production images" },
    ],
    stack: ["WebSockets", "Cloudflare Workers", "Redis Pub/Sub", "AWS ECS", "Docker Distroless", "GitHub Actions"],
    quote: {
      text: "Deploying updates on Friday afternoon used to be terrifying. With VENIZOR’s release matrix, we push code constantly with zero fleet disruption.",
      author: "Julian Chen",
      role: "Head of Infrastructure, Nexus Logistics",
    },
  },
  {
    id: "hyperscale-ecommerce",
    client: "HyperScale Retail",
    industry: "E-Commerce",
    headline: "Search Experience Optimization (SXO) Yields +34% Conversion Uplift Under Peak Load",
    summary:
      "Redesigned full-stack e-commerce architecture combining sub-100ms interaction feedback, partial index database queries, and edge webhook cache purges.",
    challenge:
      "A slow 3.2-second mobile Time to Interactive (TTI) was bleeding mobile conversion rates, while high-traffic product catalog searches choked unindexed database tables.",
    solution:
      "Rebuilt the client layer with Next.js App Router, eliminated layout shifts, created targeted partial B-Tree indexes on active inventory, and wired automated Cloudflare cache purges via inventory webhooks.",
    metrics: [
      { label: "Conversion Uplift", value: "+34%", detail: "Direct revenue growth post-launch" },
      { label: "TTFB at Edge", value: "18ms", detail: "Global Cloudflare cached response" },
      { label: "Cache Hit Ratio", value: "99.8%", detail: "Edge CDN absorbs catalog queries" },
      { label: "Cumulative Layout Shift", value: "0.00", detail: "Flawless Core Web Vitals rating" },
    ],
    stack: ["Next.js App Router", "PostgreSQL", "Partial B-Tree", "Cloudflare CDN", "SXO Engine"],
    quote: {
      text: "Speed directly translates to revenue. VENIZOR’s SXO engineering generated our most profitable quarter to date.",
      author: "Sarah Lindqvist",
      role: "Chief Commercial Officer, HyperScale",
    },
  },
];

export default function CaseStudiesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");

  const filteredStudies = caseStudies.filter(
    (cs) => selectedIndustry === "All" || cs.industry === selectedIndustry
  );

  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <CursorFollower />
        <PageHeader activePage="blog" />

        <main id="cases-main" className="inner-page-main">
          {/* Hero Section */}
          <section className="page-hero page-container" aria-labelledby="cases-title">
            <div className="page-hero-kicker">
              <span className="kicker-tag">
                <i className="live-dot" /> PROVEN ARCHITECTURAL IMPACT
              </span>
              <span>VERIFIED METRICS • ENTERPRISE BENCHMARKS • REAL SCALE</span>
            </div>

            <h1 id="cases-title" className="page-hero-title">
              Quantified Case Studies &amp; <br />
              <span className="hero-title-blue">Production Telemetry.</span>
            </h1>

            <p className="page-hero-lead">
              We don’t rely on subjective promises. Explore verified architectural case studies detailing
              how VENIZOR solves high-load API bottlenecks, scales AI systems, and hardens web platforms for enterprise scale.
            </p>

            {/* Filter Pills */}
            <div className="blog-category-pills" style={{ marginTop: 24 }}>
              {["All", "FinTech", "AI & Healthcare", "Logistics & IoT", "E-Commerce"].map((ind) => (
                <button
                  key={ind}
                  type="button"
                  className="blog-cat-pill"
                  data-active={selectedIndustry === ind}
                  onClick={() => setSelectedIndustry(ind)}
                >
                  {ind}
                </button>
              ))}
            </div>
          </section>

          {/* Case Studies Stack */}
          <div className="page-container cases-stack-section">
            {filteredStudies.map((study) => (
              <article key={study.id} className="case-study-feature-card">
                {/* Header */}
                <div className="case-card-header">
                  <div className="case-meta-top">
                    <span className="case-client-badge">{study.client}</span>
                    <span className="case-industry-tag">{study.industry}</span>
                  </div>
                  <h2 className="case-card-title">{study.headline}</h2>
                  <p className="case-card-summary">{study.summary}</p>
                </div>

                {/* Metrics Banner */}
                <div className="case-metrics-grid">
                  {study.metrics.map((m) => (
                    <div key={m.label} className="case-metric-tile">
                      <span className="case-metric-label">{m.label}</span>
                      <strong className="case-metric-val">{m.value}</strong>
                      <span className="case-metric-detail">{m.detail}</span>
                    </div>
                  ))}
                </div>

                {/* Architecture Deep Dive Columns */}
                <div className="case-details-split">
                  <div className="case-deep-col">
                    <div className="deep-col-heading">
                      <span className="dot red" />
                      <h4>The Architectural Bottleneck</h4>
                    </div>
                    <p>{study.challenge}</p>
                  </div>

                  <div className="case-deep-col">
                    <div className="deep-col-heading">
                      <span className="dot green" />
                      <h4>The VENIZOR Engineering Solution</h4>
                    </div>
                    <p>{study.solution}</p>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <blockquote className="case-quote-box">
                  <p className="quote-text">&ldquo;{study.quote.text}&rdquo;</p>
                  <footer className="quote-footer">
                    <strong>{study.quote.author}</strong> — <span>{study.quote.role}</span>
                  </footer>
                </blockquote>

                {/* Tech Stack Pills & CTA */}
                <div className="case-card-footer">
                  <div className="case-stack-tags">
                    {study.stack.map((tech) => (
                      <span key={tech} className="tech-badge">
                        <code>{tech}</code>
                      </span>
                    ))}
                  </div>

                  <Link href="/contact" className="case-cta-link">
                    Architect a similar solution <ArrowUpRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Action Strip */}
          <section className="page-container about-action-strip">
            <h2>Have an ambitious system that needs production hardening?</h2>
            <p>
              Our principal engineers design, test, and deploy resilient web systems ready for millions of requests.
            </p>
            <Link href="/contact" className="pill-button dark">
              Schedule an architecture discovery session <ArrowUpRight size={18} />
            </Link>
          </section>
        </main>

        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
