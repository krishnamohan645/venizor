"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Sparkles, BookOpen, Clock, Tag, Cpu, ShieldCheck } from "lucide-react";
import { ExperienceProvider } from "@/components/experience";
import { CursorFollower } from "@/components/motion-details";
import { PageHeader, PageFooter } from "@/components/page-nav";
import { FaqJsonLd } from "@/components/json-ld";
import { blogPosts, type BlogPost } from "@/data/blog-data";

const categories = [
  "All",
  "APIs & Integrations",
  "AI & Automation",
  "Databases",
  "Cloud & DevOps",
  "Security",
  "Digital Marketing & SXO",
];

const blogFaqs = [
  {
    q: "How does VENIZOR integrate third-party HTTPS APIs with our existing tech stack?",
    a: "We engineer resilient API integration layers using TypeScript, cryptographic SHA-256 idempotency hashing, exponential jitter backoff, BullMQ/Redis background task queues, and circuit breaker patterns to prevent external API downtime from impacting your core platform.",
  },
  {
    q: "What AI models and architectures does VENIZOR support for business applications?",
    a: "We build production-ready AI workflows integrating OpenAI, Anthropic, Gemini, Groq, and open-source models via vLLM/Ollama. Our architectures feature hybrid vector search (pgvector + BM25 full-text), deterministic guardrails, structured JSON outputs, and streaming Server-Sent Events (SSE).",
  },
  {
    q: "How do you handle database scalability and DevOps for high-traffic platforms?",
    a: "We utilize PostgreSQL with PgBouncer transaction pooling, partial indexing, read-replicas, and query profiling via EXPLAIN ANALYZE. DevOps is managed through multi-stage Docker containers, automated GitHub Actions CI/CD pipelines, Cloudflare edge caching, and zero-downtime blue-green deployments.",
  },
];

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];

  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <CursorFollower />
        <PageHeader activePage="blog" />

        <main id="blog-main" className="inner-page-main">
          {/* Hero Section */}
          <section className="page-hero page-container" aria-labelledby="blog-hero-title">
            <div className="page-hero-kicker">
              <span className="kicker-tag">
                <i className="live-dot" /> 01 / FIELD NOTES &amp; INTELLIGENCE
              </span>
              <span>ENGINEERING BLUEPRINTS • APPLIED AI • CLOUD &amp; GROWTH</span>
            </div>

            <h1 id="blog-hero-title" className="page-hero-title">
              Thinking out loud. <br />
              <span className="hero-title-blue">Perspectives on modern software.</span>
            </h1>

            <p className="page-hero-lead">
              Technical deep-dives, architectural blueprints, and growth frameworks written
              directly by the product architects, AI specialists, and systems engineers at VENIZOR.
            </p>

            {/* Search & Filter Toolbar */}
            <div className="blog-toolbar">
              <div className="blog-search-wrap">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search articles by topic, stack, or problem..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="blog-search-input"
                  aria-label="Search articles"
                />
              </div>

              <div className="blog-category-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className="blog-cat-pill"
                    data-active={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Post Spotlight (When showing All and no search) */}
          {selectedCategory === "All" && !searchQuery && (
            <section className="featured-article-section page-container" aria-label="Featured article">
              <Link href={`/blog/${featuredPost.slug}`} className="featured-article-card">
                <div className="featured-card-content">
                  <div className="featured-badge-row">
                    <span className="featured-kicker">FEATURED ARCHITECTURE BLUEPRINT</span>
                    <span className="featured-time">{featuredPost.readTime}</span>
                  </div>
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.excerpt}</p>
                  <div className="featured-footer">
                    <span className="featured-author">{featuredPost.author.name}</span>
                    <span className="featured-read-link">
                      Read blueprint <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>

                <div className="featured-visual-pane" aria-hidden="true">
                  <div className="featured-tech-grid">
                    <div className="tech-tile">
                      <span className="tech-tile-lbl">GATEWAY</span>
                      <span className="tech-tile-val">HTTPS / REST</span>
                    </div>
                    <div className="tech-tile">
                      <span className="tech-tile-lbl">IDEMPOTENCY</span>
                      <span className="tech-tile-val">SHA-256</span>
                    </div>
                    <div className="tech-tile">
                      <span className="tech-tile-lbl">ASYNC QUEUE</span>
                      <span className="tech-tile-val">BullMQ / Redis</span>
                    </div>
                    <div className="tech-tile">
                      <span className="tech-tile-lbl">CIRCUIT BREAKER</span>
                      <span className="tech-tile-val">Active Guard</span>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Articles Grid */}
          <section className="blog-grid-section page-container" aria-label="Articles list">
            <div className="section-head" style={{ marginBottom: 28 }}>
              <span className="section-kicker">CURATED PERSPECTIVES</span>
              <h2 style={{ fontSize: "28px" }}>Latest field notes ({filteredPosts.length})</h2>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="blog-empty-state">
                <p>No articles found matching your criteria. Try adjusting your search query.</p>
                <button
                  type="button"
                  className="pill-button dark"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  style={{ marginTop: 16 }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="articles-bento-grid">
                {filteredPosts.map((post) => (
                  <article key={post.slug} className="article-card">
                    <Link href={`/blog/${post.slug}`} className="article-card-inner">
                      <div className="article-card-top">
                        <span className="article-cat-tag">{post.category}</span>
                        <span className="article-date">{post.readTime}</span>
                      </div>

                      <h3 className="article-title">{post.title}</h3>
                      <p className="article-excerpt">{post.excerpt}</p>

                      {post.architectureBadges && post.architectureBadges.length > 0 && (
                        <div className="article-pipeline-strip" aria-label="Architecture steps">
                          {post.architectureBadges.map((badge, bIdx) => (
                            <span key={badge} className="pipeline-step-badge">
                              {bIdx > 0 && <span className="pipeline-arrow">➔</span>}
                              <code>{badge}</code>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="article-card-bottom">
                        <span className="article-date-pub">{post.publishDate}</span>
                        <span className="article-read-btn">
                          Read article <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* AEO / GEO Technical FAQ Section */}
          <section className="blog-faq-section page-container" aria-labelledby="blog-faq-title">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <span className="section-kicker">ENGINEERING CAPABILITIES</span>
              <h2 id="blog-faq-title" style={{ fontSize: "28px" }}>
                Frequently explored technical questions
              </h2>
            </div>

            <div className="faq-stack">
              {blogFaqs.map((faq) => (
                <details key={faq.q} className="faq-item">
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>

            <FaqJsonLd faqs={blogFaqs} />
          </section>

          {/* Bottom CTA Banner */}
          <section className="about-action-strip page-container">
            <h2>Have a technical challenge or ambitious product vision?</h2>
            <p>
              Our principal engineers and product architects are ready to review your architecture.
            </p>
            <Link href="/contact" className="pill-button dark">
              Discuss your project with us <ArrowUpRight size={18} />
            </Link>
          </section>
        </main>

        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
