import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Clock, Calendar, Share2, Tag, BookOpen } from "lucide-react";
import { ExperienceProvider } from "@/components/experience";
import { CursorFollower } from "@/components/motion-details";
import { PageHeader, PageFooter } from "@/components/page-nav";
import { ArticleJsonLd } from "@/components/json-ld";
import { BlogArchitectureDiagram } from "@/components/blog-diagrams";
import { blogPosts, type BlogPost } from "@/data/blog-data";

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

  return {
    title: `${post.title} — VENIZOR Field Notes`,
    description: post.excerpt,
    alternates: {
      canonical: `https://venizor.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://venizor.com/blog/${post.slug}`,
      type: "article",
      publishedTime: new Date(post.publishDate).toISOString(),
      authors: [post.author.name],
      tags: [post.category, ...post.keyTakeaways],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

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
        <CursorFollower />
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

          {/* Article Content Body */}
          <article className="page-container article-prose-wrap">
            <BlogArchitectureDiagram slug={post.slug} />

            {post.content.map((section, idx) => (
              <section key={section.sectionHeading} className="article-section">
                <h2>{section.sectionHeading}</h2>
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}

                {section.codeSnippet && (
                  <div className="article-code-block">
                    {section.codeSnippet.caption && (
                      <div className="code-caption">
                        <span>{section.codeSnippet.caption}</span>
                        <span className="code-lang">
                          {section.codeSnippet.language}
                        </span>
                      </div>
                    )}
                    <pre>
                      <code>{section.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}
          </article>

          {/* Author Card & Engagement */}
          <div className="page-container" style={{ marginBlock: 60 }}>
            <div className="article-author-card">
              <div>
                <span className="author-badge">ABOUT THE AUTHORS</span>
                <h4>{post.author.name}</h4>
                <p>
                  Specializing in mission-critical digital products, high-throughput APIs,
                  applied AI pipelines, and resilient cloud architectures at VENIZOR.
                </p>
              </div>
              <Link href="/contact" className="pill-button dark">
                Consult with our team <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <section className="page-container related-articles-section">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <span className="section-kicker">CONTINUE EXPLORING</span>
              <h3 style={{ fontSize: "24px" }}>Related architecture notes</h3>
            </div>

            <div className="articles-bento-grid">
              {relatedPosts.map((rel) => (
                <article key={rel.slug} className="article-card">
                  <Link href={`/blog/${rel.slug}`} className="article-card-inner">
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
