import { ExperienceProvider } from "@/components/experience";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { PageFooter, PageHeader } from "@/components/page-nav";
import { pageMetadata } from "@/lib/metadata";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const metadata = pageMetadata("/about");

const stats = [
  {
    num: "Discover",
    label:
      "Understand the people, workflow and problem before planning a solution.",
  },
  { num: "Design", label: "Make the next step clear, accessible and useful." },
  {
    num: "Build",
    label: "Choose maintainable tools and test the important journeys.",
  },
  {
    num: "Improve",
    label: "Learn from evidence and agree the next useful release.",
  },
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
    desc: "Smooth spring physics, typographic rhythm, accessibility reviews and keyboard testing, and responsive fluidity. When software feels this refined, users trust your brand from the very first tap.",
  },
  {
    index: "03",
    tag: "REAL IMPACT",
    title: "Pragmatic AI & Automation",
    desc: "We bypass superficial AI gimmicks. We engineer dependable production pipelines with vector search, multimodal intelligence, and automated operations whose value can be evaluated against real team workflows.",
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
    desc: "Turn an ambitious concept or napkin sketch into a battle-tested, revenue-ready production MVP with a timeline agreed after discovery.",
    tags: [
      "Product Strategy",
      "System Architecture",
      "MVP Launch",
      "Full-Stack Build",
    ],
  },
  {
    number: "MODEL 02",
    title: "Dedicated Engineering Pod",
    desc: "An embedded squad of senior engineers, product designers, and AI specialists accelerating your key roadmap initiatives.",
    tags: [
      "Sprint-Based",
      "Direct Slack / GitHub Sync",
      "Zero Overhead",
      "Flexible Scale",
    ],
  },
  {
    number: "MODEL 03",
    title: "Modernization & AI Integration",
    desc: "Refactor legacy bottlenecks, migrate to modern serverless edge architecture, and deploy customized automation pipelines.",
    tags: [
      "Cloud Migration",
      "Performance Tuning",
      "AI Workflows",
      "Design System",
    ],
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

        <BreadcrumbJsonLd path="/about" />
        <PageHeader activePage="about" />

        <main id="about-main" className="inner-page-main">
          {/* Hero Section */}
          <section
            className="page-hero page-container"
            aria-labelledby="about-hero-title"
          >
            <div className="page-hero-kicker">
              <span className="kicker-tag">
                <i className="live-dot" /> 01 / WHO WE ARE
              </span>
              <span>
                INDEPENDENT TECHNOLOGY &amp; DIGITAL INNOVATION STUDIO
              </span>
            </div>

            <h1 id="about-hero-title" className="page-hero-title">
              Built on purpose. <br />
              <span className="hero-title-blue">Engineered for momentum.</span>
            </h1>

            <p className="page-hero-lead">
              VENIZOR is an independent digital product and technology studio
              based in India, building software, platforms, and intelligent
              systems for ambitious founders and modern enterprises around the
              world.
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
          <section
            className="about-stats-strip page-container"
            aria-label="Studio highlights"
          >
            {stats.map((s) => (
              <div key={s.num} className="about-stat-item">
                <div className="about-stat-num blue">{s.num}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </section>

          {/* The Story Section */}
          <section
            className="about-story-section page-container"
            aria-labelledby="story-title"
          >
            <div className="section-side-label">
              <span className="section-kicker">02 / THE STORY</span>
            </div>

            <div>
              <h2 id="story-title" className="about-narrative-header">
                We founded VENIZOR with a simple conviction: software should
                feel like craft, not an assembly line.
              </h2>

              <div className="about-columns-grid">
                <div className="about-column">
                  <p>
                    <strong>Begin with a useful question.</strong> What are
                    people trying to accomplish, and what makes that difficult
                    today? We use those answers to shape the scope, the
                    interface and the system behind it.
                  </p>
                  <p>
                    A focused first release makes decisions easier to test. We
                    agree the important journeys and review the result against
                    them.
                  </p>
                </div>
                <div className="about-column">
                  <p>
                    <strong>Keep the work understandable.</strong> Design
                    choices, technical trade-offs and delivery responsibilities
                    should be visible to everyone involved.
                  </p>
                  <p>
                    From a new product to an existing business workflow, our aim
                    is to connect considered design with maintainable
                    engineering.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Principles Bento */}
          <section
            className="about-values-section page-container"
            aria-labelledby="principles-title"
          >
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
          <section
            className="about-models-section page-container"
            aria-labelledby="models-title"
          >
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
          <section
            className="about-team-section page-container"
            aria-labelledby="team-title"
          >
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
              Tell us about your upcoming initiative. We will review your
              objectives and map out an actionable roadmap.
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
