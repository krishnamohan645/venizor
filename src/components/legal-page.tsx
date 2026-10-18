import Link from "next/link";
import { ExperienceProvider } from "./experience";
import { BreadcrumbJsonLd } from "./json-ld";
import { PageFooter, PageHeader } from "./page-nav";

export function LegalPage({
  title,
  path,
  children,
}: {
  title: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <PageHeader />
        <BreadcrumbJsonLd path={path} />
        <main className="inner-page-main" id="main">
          <section className="page-hero page-container">
            <span className="section-kicker">
              VENIZOR / WEBSITE INFORMATION
            </span>
            <h1 className="page-hero-title">{title}</h1>
            <p className="page-hero-lead">
              Last updated: 18 October 2026. Questions?{" "}
              <Link href="mailto:info@venizor.com">info@venizor.com</Link>
            </p>
          </section>
          <article className="legal-prose page-container">{children}</article>
        </main>
        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
