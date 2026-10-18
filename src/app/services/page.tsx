import { ExperienceProvider } from "@/components/experience";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { PageFooter, PageHeader } from "@/components/page-nav";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const metadata = pageMetadata("/services");
export default function ServicesPage() {
  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <PageHeader />
        <BreadcrumbJsonLd path="/services" />
        <main id="main" className="inner-page-main">
          <section className="page-hero page-container">
            <span className="section-kicker">OUR CAPABILITIES / 01—08</span>
            <h1 className="page-hero-title">
              Good ideas.
              <br />
              <span className="hero-title-blue">Considered execution.</span>
            </h1>
            <p className="page-hero-lead">
              From the first question to the next release. Find the support your
              business needs.
            </p>
          </section>
          <section
            className="service-directory page-container"
            aria-label="Explore our services"
          >
            {services.map((service, i) => (
              <Link
                href={`/services/${service.slug}`}
                key={service.slug}
                className="service-directory-row"
              >
                <span className="section-kicker">0{i + 1}</span>
                <div>
                  <h2>{service.name}</h2>
                  <p>{service.audience}</p>
                </div>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </section>
        </main>
        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
