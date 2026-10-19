import {
  ArticleTableOfContents,
  DevReactions,
  InteractiveCodeBlock,
  ReadingProgressBar,
} from "@/components/blog-dev-features";
import { BlogArchitectureDiagram } from "@/components/blog-diagrams";
import { ExperienceProvider } from "@/components/experience";
import { ArticleJsonLd } from "@/components/json-ld";
import { PageFooter, PageHeader } from "@/components/page-nav";
import { blogPosts } from "@/data/blog-data";
import { pageMetadata } from "@/lib/metadata";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const base = pageMetadata(`/blog/${post.slug}`, post.title, post.excerpt);
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: new Date(post.publishDate).toISOString(),
      modifiedTime: new Date(
        post.modifiedDate || post.publishDate,
      ).toISOString(),
      authors: [post.author.name],
    },
  };
}

export const instant = false;

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <a className="skip-link" href="#article-main">
          Skip to content
        </a>
        <ReadingProgressBar />

        <PageHeader activePage="blog" />
        <ArticleJsonLd post={post} />

        <main id="article-main" className="inner-page-main">
          {/* Breadcrumb & Top Bar */}
          <div className="page-container article-top-bar">
            <Link href="/blog" className="article-back-link">
              <ArrowLeft size={16} /> Back to all articles
            </Link>
            <span className="article-cat-pill">{post.category}</span>
          </div>

          {/* Article Header */}
          <header className="page-container article-header">
            <h1 className="article-main-title">{post.title}</h1>
            <p className="article-main-lead">{post.excerpt}</p>

            <div className="article-meta-row">
              <div className="article-author-info">
                <span className="author-name">{post.author.name}</span>
                <span className="author-role">{post.author.role}</span>
              </div>
              <div className="article-reading-info">
                <span>
                  <Calendar size={14} /> {post.publishDate}
                </span>
                <span>
                  <Clock size={14} /> {post.readTime}
                </span>
              </div>
            </div>
          </header>

          {/* Key Takeaways Callout (AEO / GEO Highlights) */}
          <div className="page-container" style={{ marginBottom: 40 }}>
            <div className="takeaways-callout">
              <span className="takeaways-title">
                <BookOpen size={16} /> KEY ARCHITECTURAL TAKEAWAYS
              </span>
              <ul className="takeaways-list">
                {post.keyTakeaways.map((point) => (
                  <li key={point}>
                    <Check size={16} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Article Layout with Sidebar TOC & Dev Reactions */}
          <div className="page-container article-layout-grid">
            <aside className="article-left-rail">
              <DevReactions slug={post.slug} />
              <ArticleTableOfContents
                headings={post.content.map((c) => c.sectionHeading)}
              />
            </aside>

            {/* Article Content Body */}
            <article className="article-prose-wrap">
              <p className="article-evidence-note">
                An educational field note with illustrative architecture and
                code. Example metrics and outputs are not VENIZOR production
                benchmarks.{" "}
                {post.modifiedDate && <>Updated: {post.modifiedDate}.</>}
              </p>
              <BlogArchitectureDiagram slug={post.slug} />

              {post.content.map((section, idx) => (
                <section
                  key={section.sectionHeading}
                  id={`section-${idx}`}
                  className="article-section"
                >
                  <h2>{section.sectionHeading}</h2>
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}

                  {section.codeSnippet && (
                    <InteractiveCodeBlock
                      code={section.codeSnippet.code}
                      language={section.codeSnippet.language}
                      caption={section.codeSnippet.caption}
                    />
                  )}
                </section>
              ))}
            </article>
          </div>

          {/* Author Card & Engagement */}
          <div className="page-container" style={{ marginBlock: 60 }}>
            <div className="article-author-card">
              <div>
                <span className="author-badge">ABOUT THE AUTHORS</span>
                <h4>{post.author.name}</h4>
                <p>
                  Specializing in mission-critical digital products,
                  high-throughput APIs, applied AI pipelines, and resilient
                  cloud architectures at VENIZOR.
                </p>
              </div>
              <Link href="/contact" className="pill-button dark">
                Consult with our team <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <section className="page-container related-articles-section">
            <div className="blog-section-heading" style={{ marginBottom: 24 }}>
              <span className="blog-kicker-tag">CONTINUE EXPLORING</span>
              <h3 className="blog-section-title" style={{ fontSize: "24px" }}>
                Related architecture notes
              </h3>
            </div>

            <div className="articles-bento-grid">
              {relatedPosts.map((rel) => (
                <article key={rel.slug} className="article-card">
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="article-card-inner"
                  >
                    <div className="article-card-top">
                      <span className="article-cat-tag">{rel.category}</span>
                      <span className="article-date">{rel.readTime}</span>
                    </div>
                    <h4 className="article-title">{rel.title}</h4>
                    <p className="article-excerpt">{rel.excerpt}</p>
                    <div className="article-card-bottom">
                      <span className="article-read-btn">
                        Read blueprint <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </main>

        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
