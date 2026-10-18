"use client";
import { ExperienceProvider, Reveal } from "@/components/experience";
import { PageFooter, PageHeader } from "@/components/page-nav";
import { scenarios } from "@/data/scenarios";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function CaseStudiesPage() {
  const [industry, setIndustry] = useState("All");
  const filtered = scenarios.filter(
    (item) => industry === "All" || item.industry === industry,
  );
  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <a className="skip-link" href="#cases-main">
          Skip to content
        </a>
        <PageHeader />
        <main id="cases-main" className="inner-page-main">
          <section className="page-hero page-container">
            <span className="section-kicker">
              ILLUSTRATIVE ARCHITECTURE SCENARIOS
            </span>
            <h1 className="page-hero-title">
              Different challenges.
              <br />
              <span className="hero-title-blue">Considered approaches.</span>
            </h1>
            <p className="page-hero-lead">
              Explore how a system could be designed. These are educational
              scenarios, not completed client projects, testimonials or measured
              production results.
            </p>
            <div className="blog-category-pills" aria-label="Filter scenarios">
              {["All", ...scenarios.map((item) => item.industry)].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className="blog-cat-pill"
                    aria-pressed={industry === item}
                    data-active={industry === item}
                    onClick={() => setIndustry(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </section>
          <section
            className="scenario-list page-container"
            aria-label="Architecture scenarios"
          >
            {filtered.map((item, i) => (
              <Reveal key={item.id} className="scenario-story">
                <div className="scenario-story-heading" id={item.id}>
                  <span className="section-kicker">
                    0{i + 1} / {item.industry.toUpperCase()} / ILLUSTRATIVE
                  </span>
                  <h2>{item.name}</h2>
                  <p>{item.summary}</p>
                </div>
                <div className="scenario-story-body">
                  {[
                    { title: "The challenge", text: item.challenge },
                    { title: "A possible approach", text: item.approach },
                    { title: "What to verify", text: item.verify },
                  ].map((part) => (
                    <div key={part.title}>
                      <h3>{part.title}</h3>
                      <p>{part.text}</p>
                    </div>
                  ))}
                </div>
                <div className="scenario-story-footer">
                  <span>{item.stack.join(" / ")}</span>
                  <Link
                    className="text-link"
                    href={`/services/${item.service}`}
                  >
                    Explore this service <ArrowUpRight size={17} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </section>
          <section className="about-action-strip page-container">
            <h2>What does your system need?</h2>
            <p>
              A useful architecture starts with your users, constraints and
              operating context.
            </p>
            <Link className="pill-button dark" href="/contact">
              Discuss your project <ArrowUpRight size={17} />
            </Link>
          </section>
        </main>
        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
