import { ExperienceProvider, Reveal } from "@/components/experience";
import { BreadcrumbJsonLd, FaqJsonLd, JsonLd } from "@/components/json-ld";
import { PageFooter, PageHeader } from "@/components/page-nav";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service
    ? pageMetadata(
        `/services/${slug}`,
        `${service.name} for Businesses & Product Teams`,
        service.intro,
      )
    : {};
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const path = `/services/${slug}`;
  return (
    <ExperienceProvider>
      <div className="inner-page-shell service-detail" id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <PageHeader />
        <BreadcrumbJsonLd
          path={path}
          label={service.name}
          parent={{ name: "Services", path: "/services" }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            description: service.intro,
            url: site.url + path,
            provider: {
              "@type": "Organization",
              "@id": site.url + "/#organization",
              name: site.name,
            },
          }}
        />
        <main id="main" className="inner-page-main">
          <section className="page-hero page-container">
            <Link href="/services" className="section-kicker">
              SERVICES / {service.name.toUpperCase()}
            </Link>
            <h1 className="page-hero-title">
              {service.name}
              <br />
              <span className="hero-title-blue">{service.audience}.</span>
            </h1>
            <p className="page-hero-lead service-direct-answer">
              {service.intro}
            </p>
            <Link className="pill-button dark" href="/contact">
              Discuss your project <ArrowUpRight size={17} />
            </Link>
          </section>
          <Reveal className="service-delivery page-container">
            <div>
              <span className="section-kicker">WHAT WE DELIVER</span>
              <h2>
                A useful result.
                <br />A clear handover.
              </h2>
            </div>
            <ul>
              {service.deliverables.map((item) => (
                <li key={item}>
                  <Check size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <section className="service-method page-container">
            <span className="section-kicker">HOW WE WORK</span>
            <div className="service-process-grid">
              {[
                {
                  title: "Understand",
                  text: "Agree the audience, the problem, constraints and what a useful result looks like.",
                },
                {
                  title: "Shape",
                  text: "Review options, prototype the important journeys and agree scope and acceptance criteria.",
                },
                {
                  title: "Build & review",
                  text: "Deliver in reviewable increments, test the critical paths and share progress.",
                },
                {
                  title: "Release & learn",
                  text: "Prepare the handover, agree operating responsibilities and measure what needs improving.",
                },
              ].map((step, i) => (
                <Reveal key={step.title}>
                  <span className="section-kicker">0{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Reveal>
              ))}
            </div>
            <p className="service-scope-note">
              Timeline and cost depend on scope, access, content readiness and
              review cycles. We provide a written estimate after discovery; the
              website does not promise a fixed delivery window.
            </p>
          </section>
          <section className="service-example page-container">
            <div>
              <span className="section-kicker">
                AN ILLUSTRATIVE STARTING POINT
              </span>
              <h2>{service.example}</h2>
              <p>
                This is an example of a possible engagement, rather than a
                completed client project.
              </p>
              <Link href="/case-studies" className="text-link">
                Explore architecture scenarios <ArrowUpRight size={17} />
              </Link>
            </div>
            <div>
              <span className="section-kicker">TOOLS WE MAY USE</span>
              <div className="service-tech-list">
                {service.technologies.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p>The final stack follows your requirements and team context.</p>
            </div>
          </section>
          <section className="contact-faq-section page-container">
            <span className="section-kicker">BEFORE WE START</span>
            <h2>Your questions, answered.</h2>
            <div className="faq-stack">
              {service.questions.map(({ q, a }) => (
                <details className="faq-item" key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
            <FaqJsonLd faqs={service.questions} />
          </section>
          <section className="about-action-strip page-container">
            <h2>Let’s find the right next step.</h2>
            <p>
              Tell us about the workflow, product or business you want to
              improve.
            </p>
            <Link href="/contact" className="pill-button dark">
              Start a conversation <ArrowUpRight size={17} />
            </Link>
          </section>
        </main>
        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
