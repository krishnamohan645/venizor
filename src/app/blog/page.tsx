"use client";
import { ArticleArt } from "@/components/article-art";
import { ExperienceProvider, Reveal } from "@/components/experience";
import { PageFooter, PageHeader } from "@/components/page-nav";
import { StudioVisual } from "@/components/studio-visual";
import { blogPosts } from "@/data/blog-data";
import { ArrowDown, ArrowUpRight, Pause, Play, Search, X } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const categories = ["All", ...new Set(blogPosts.map((post) => post.category))];
function subscribeSearch(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("venizor-search", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("venizor-search", callback);
  };
}
const shortTitles: Record<string, string> = {
  "connecting-third-party-https-apis": "When an API fails, what happens next?",
  "integrating-production-ai-workflows":
    "AI that fits the way your business works.",
  "postgresql-at-scale-connection-pooling":
    "Give your database room to breathe.",
  "zero-downtime-deployments-devops-playbook":
    "A more considered path to production.",
  "hardening-modern-web-applications-security":
    "Security starts with the boundaries.",
  "mastering-seo-aeo-geo-sxo-2026": "Be useful. Be understood. Be found.",
  "the-race-to-superintelligence-asi-hardware-frontiers":
    "The hardware behind the next AI frontier.",
  "how-ai-is-evolving-agentic-reasoning-loops":
    "From answering questions to taking action.",
  "how-big-tech-engineers-hyper-scale-apps":
    "What changes when your system grows?",
  "securing-ai-production-systems": "Give AI tools boundaries worth trusting.",
  "solving-the-distributed-dual-write-problem":
    "One change. Two systems. What could go wrong?",
  "how-applications-are-built-in-this-era":
    "The tools change. The craft still matters.",
};
export default function BlogIndexPage() {
  const [category, setCategory] = useState("All");
  const query = useSyncExternalStore(
    subscribeSearch,
    () => new URLSearchParams(location.search).get("q") || "",
    () => "",
  );
  const [paused, setPaused] = useState(false);
  const posts = blogPosts.filter(
    (post) =>
      (category === "All" || post.category === category) &&
      `${post.title} ${post.excerpt} ${post.category} ${shortTitles[post.slug] || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const featured = blogPosts.find((post) => post.featured) || blogPosts[0];
  const updateQuery = (value: string) => {
    const url = new URL(location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    history.replaceState(history.state, "", url);
    window.dispatchEvent(new Event("venizor-search"));
  };
  return (
    <ExperienceProvider>
      <div
        className="inner-page-shell journal"
        id="top"
        data-motion-paused={paused}
      >
        <a className="skip-link" href="#blog-main">
          Skip to content
        </a>
        <PageHeader activePage="blog" />
        <main id="blog-main" className="inner-page-main">
          <section
            className="journal-hero page-container"
            aria-labelledby="blog-hero-title"
          >
            <div className="journal-masthead">
              <span className="section-kicker">VENIZOR / FIELD NOTES</span>
              <span className="section-kicker">
                SOFTWARE. PEOPLE. POSSIBILITIES.
              </span>
            </div>
            <Reveal>
              <h1 id="blog-hero-title">
                Ideas for
                <br />
                <span>what’s next.</span>
              </h1>
            </Reveal>
            <div className="journal-intro">
              <p>
                From the studio.
                <br />
                For the curious.
              </p>
              <p>
                Notes on software, practical AI and the decisions behind useful
                digital products. Read, explore and bring your own questions.
              </p>
              <a
                href="#articles"
                className="circle-link"
                aria-label="Browse field notes"
              >
                <ArrowDown size={24} />
              </a>
            </div>
          </section>
          {category === "All" && !query && (
            <section
              className="journal-feature page-container"
              aria-label="Editor's pick"
            >
              <Reveal>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="journal-feature-link"
                >
                  <div className="journal-feature-copy">
                    <span className="section-kicker">
                      EDITOR’S PICK / {featured.category.toUpperCase()}
                    </span>
                    <h2>{shortTitles[featured.slug] || featured.title}</h2>
                    <p>
                      Timeouts, retries and the space between systems. A
                      practical look at designing an integration that knows how
                      to recover.
                    </p>
                    <span className="journal-feature-meta">
                      {featured.readTime}
                      <span className="text-link">
                        Read the field note <ArrowUpRight size={20} />
                      </span>
                    </span>
                  </div>
                  <StudioVisual kind="payments" paused={paused} />
                </Link>
              </Reveal>
            </section>
          )}
          <section
            className="journal-library page-container"
            id="articles"
            aria-labelledby="articles-heading"
          >
            <div className="journal-library-heading">
              <div>
                <span className="section-kicker">THE READING ROOM</span>
                <h2 id="articles-heading">The latest thinking.</h2>
              </div>
              <button
                type="button"
                className="journal-motion-control"
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
                {paused ? "Play illustrations" : "Pause illustrations"}
              </button>
            </div>
            <div className="journal-filters">
              <div className="blog-search-wrap">
                <Search size={18} />
                <input
                  className="blog-search-input"
                  type="search"
                  aria-label="Search articles"
                  placeholder="Find a topic, question or idea"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Clear search"
                    onClick={() => updateQuery("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div
                className="blog-category-pills"
                aria-label="Filter articles by topic"
              >
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="blog-cat-pill"
                    aria-pressed={category === item}
                    data-active={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <p className="journal-result-count" role="status">
              {posts.length} {posts.length === 1 ? "field note" : "field notes"}
              {category !== "All" ? ` / ${category}` : " / All topics"}
            </p>
            {posts.length ? (
              <div className="journal-articles">
                {posts.map((post, index) => (
                  <Reveal
                    key={post.slug}
                    className="journal-row-reveal"
                    delay={(index % 3) * 0.07}
                  >
                    <article className="journal-article article-card">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="journal-article-link"
                      >
                        <span className="journal-article-index">
                          {String(blogPosts.indexOf(post) + 1).padStart(2, "0")}
                        </span>
                        <div className="journal-article-copy">
                          <span className="section-kicker">
                            {post.category}
                          </span>
                          <h3>{shortTitles[post.slug] || post.title}</h3>
                          <p>{post.excerpt}</p>
                          <div className="journal-article-meta">
                            <time
                              dateTime={new Date(post.publishDate)
                                .toISOString()
                                .slice(0, 10)}
                            >
                              {post.publishDate}
                            </time>
                            <span>{post.readTime}</span>
                            <ArrowUpRight size={21} />
                          </div>
                        </div>
                        <ArticleArt category={post.category} />
                      </Link>
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="blog-empty-state">
                <h3>No field notes here yet.</h3>
                <p>Try another topic or a different search.</p>
                <button
                  type="button"
                  className="pill-button dark"
                  onClick={() => {
                    updateQuery("");
                    setCategory("All");
                  }}
                >
                  Clear filters <ArrowUpRight size={16} />
                </button>
              </div>
            )}
          </section>
          <section className="journal-invitation page-container">
            <span className="section-kicker">KEEP THE CONVERSATION GOING</span>
            <h2>
              What are you
              <br />
              <span>thinking about?</span>
            </h2>
            <Link href="/contact" className="pill-button dark">
              Bring us your question <ArrowUpRight size={18} />
            </Link>
          </section>
        </main>
        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
