import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Sparkles, Shield, Cpu, Code2, Users, Layers, Zap } from "lucide-react";
import { ExperienceProvider } from "@/components/experience";
import { CursorFollower } from "@/components/motion-details";
import { ScrollDirection } from "@/components/scroll-direction";
import { PageHeader, PageFooter } from "@/components/page-nav";

export const metadata: Metadata = {
  title: "Who We Are — About VENIZOR Technology & Digital Innovation Studio",
  description:
    "Learn about VENIZOR: our founding story, engineering ethos, multidisciplinary studio model, and commitment to building purposeful digital products.",
};

const stats = [
  { num: "100%", label: "In-house engineering & design. No outsourced junior tiers." },
  { num: "< 100ms", label: "Target interaction response across modern edge networks." },
  { num: "Global", label: "Partnering with founders & teams across US, Europe, India & APAC." },
  { num: "24 Hours", label: "Guaranteed turnaround on initial technical brief evaluations." },
];

const principles = [
  {
    index: "01",
    tag: "PURPOSE FIRST",
    title: "Radical Pragmatism",
    desc: "We don't chase tech fads or introduce complexity for the sake of resume padding. Every architectural choice and framework is chosen to directly maximize your business velocity and user retention.",
  },
  {
    index: "02",
    tag: "CRAFT & ERGONOMICS",
    title: "Obsessive Digital Craft",
    desc: "Smooth spring physics, typographic rhythm, accessible WCAG 2.2 Level AA compliance, and responsive fluidity. When software feels this refined, users trust your brand from the very first tap.",
  },
  {
    index: "03",
    tag: "REAL IMPACT",
    title: "Pragmatic AI & Automation",
    desc: "We bypass superficial AI gimmicks. We engineer dependable production pipelines with vector search, multimodal intelligence, and automated operations that save hundreds of real team hours.",
  },
  {
    index: "04",
    tag: "DIRECT COLLABORATION",
    title: "Transparent Senior Pods",
    desc: "No account managers playing telephone. You collaborate directly with principal engineers and product architects who take end-to-end ownership of delivery, code quality, and performance.",
  },
];

const models = [
  {
    number: "MODEL 01",
    title: "Zero-to-One Product Incubator",
    desc: "Turn an ambitious concept or napkin sketch into a battle-tested, revenue-ready production MVP in 6 to 10 weeks.",
    tags: ["Product Strategy", "System Architecture", "MVP Launch", "Full-Stack Build"],
  },
  {
    number: "MODEL 02",
    title: "Dedicated Engineering Pod",
    desc: "An embedded squad of senior engineers, product designers, and AI specialists accelerating your key roadmap initiatives.",
    tags: ["Sprint-Based", "Direct Slack / GitHub Sync", "Zero Overhead", "Flexible Scale"],
  },
  {
    number: "MODEL 03",
    title: "Modernization & AI Integration",
    desc: "Refactor legacy bottlenecks, migrate to modern serverless edge architecture, and deploy customized automation pipelines.",
    tags: ["Cloud Migration", "Performance Tuning", "AI Workflows", "Design System"],
  },
];

const teamRoles = [
  {
    badge: "SYSTEMS & STRATEGY",
    title: "Product Architecture",
    desc: "Mapping domain models, database schemas, scalable APIs, and technical trade-offs before writing the first line of code.",
  },
  {
    badge: "INTERFACE & MOTION",
    title: "Design Systems & UI Engineering",
    desc: "Building accessible design tokens, tactile micro-interactions, responsive ergonomics, and high-conversion UX flows.",
  },
  {
    badge: "INTELLIGENCE & SCALE",
    title: "AI & Cloud Infrastructure",
    desc: "Deploying low-latency edge functions, event-driven streaming, vector embeddings, and zero-downtime CI/CD pipelines.",
  },
];

export default function AboutPage() {
  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <a className="skip-link" href="#about-main">
          Skip to content
        </a>
        <CursorFollower />
        <PageHeader activePage="about" />

        <main id="about-main" className="inner-page-main">
          {/* Hero Section */}
          <section className="page-hero page-container" aria-labelledby="about-hero-title">
            <div className="page-hero-kicker">
              <span className="kicker-tag">
                <i className="live-dot" /> 01 / WHO WE ARE
              </span>
              <span>INDEPENDENT TECHNOLOGY &amp; DIGITAL INNOVATION STUDIO</span>
            </div>

            <h1 id="about-hero-title" className="page-hero-title">
              Built on purpose. <br />
              <span className="hero-title-blue">Engineered for momentum.</span>
            </h1>

            <p className="page-hero-lead">
              VENIZOR is an independent digital product and technology studio based in India,
              building software, platforms, and intelligent systems for ambitious founders and
              modern enterprises around the world.
            </p>

            <div className="page-hero-actions">
              <Link href="/contact" className="pill-button dark">
                Start a conversation <ArrowUpRight size={18} />
              </Link>
              <Link href="/#work" className="text-link">
                Explore our featured work <ArrowUpRight size={16} />
              </Link>
            </div>
          </section>

          {/* Stats Bar */}
          <section className="about-stats-strip page-container" aria-label="Studio highlights">
            {stats.map((s) => (
              <div key={s.num} className="about-stat-item">
                <div className="about-stat-num blue">{s.num}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </section>

          {/* The Story Section */}
          <section className="about-story-section page-container" aria-labelledby="story-title">
            <div className="section-side-label">
              <span className="section-kicker">02 / THE STORY</span>
            </div>

            <div>
              <h2 id="story-title" className="about-narrative-header">
                We founded VENIZOR with a simple conviction: software should feel like craft,
                not an assembly line.
              </h2>

              <div className="about-columns-grid">
                <div className="about-column">
                  <p>
                    <strong>The traditional tech services industry is broken.</strong> Large agencies
                    sell clients with polished senior partners, only to secretly hand off delivery
                    to offshore junior pools. Feature factory shops churn out unmaintainable spaghetti
                    code without understanding the underlying business model.
                  </p>
                  <p>
                    The result is always the same: missed deadlines, bloated costs, clunky user
                    experiences, and software that quickly becomes technical debt.
                  </p>
                </div>

                <div className="about-column">
                  <p>
                    <strong>VENIZOR was established as the antithesis.</strong> We operate as a high-caliber,
                    agile product collective. When you partner with us, you work directly with
                    principals who code, design, and architect alongside your leadership team.
                  </p>
                  <p>
                    From early-stage SaaS MVPs to mission-critical healthcare, logistics, and fintech
                    systems, our goal is to build digital products that make complex workflows feel
                    simple, fast, and indispensable.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Principles Bento */}
          <section className="about-values-section page-container" aria-labelledby="principles-title">
            <div className="section-side-label">
              <span className="section-kicker">03 / PRINCIPLES</span>
            </div>

            <div>
              <h2 id="principles-title" className="about-narrative-header">
                How we think, build, and make decisions every day.
              </h2>

              <div className="values-grid">
                {principles.map((p) => (
                  <div key={p.index} className="value-card">
                    <div>
                      <div className="value-card-top">
                        <span className="value-index">{p.index}</span>
                        <span className="value-pill">{p.tag}</span>
                      </div>
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Partnership Models */}
          <section className="about-models-section page-container" aria-labelledby="models-title">
            <div className="section-side-label">
              <span className="section-kicker">04 / PARTNERSHIP</span>
            </div>

            <div>
              <h2 id="models-title" className="about-narrative-header">
                Flexible engagement structures tailored to your stage.
              </h2>

              <div className="models-grid">
                {models.map((m) => (
                  <div key={m.number} className="model-card">
                    <span className="model-number">{m.number}</span>
                    <h4>{m.title}</h4>
                    <p>{m.desc}</p>
                    <div className="model-tags">
                      {m.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Collective */}
          <section className="about-team-section page-container" aria-labelledby="team-title">
            <div className="section-side-label">
              <span className="section-kicker">05 / THE COLLECTIVE</span>
            </div>

            <div>
              <h2 id="team-title" className="about-narrative-header">
                Multidisciplinary practitioners at every step.
              </h2>

              <div className="team-grid">
                {teamRoles.map((r) => (
                  <div key={r.title} className="team-role-card">
                    <span className="team-role-badge">{r.badge}</span>
                    <h4>{r.title}</h4>
                    <p>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom Action CTA Strip */}
          <section className="about-action-strip page-container">
            <h2>Ready to build something that creates real value?</h2>
            <p>
              Tell us about your upcoming initiative. We will review your objectives and
              map out an actionable roadmap.
            </p>
            <Link href="/contact" className="pill-button dark">
              Get in touch with the studio <ArrowUpRight size={18} />
            </Link>
          </section>
        </main>

        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
