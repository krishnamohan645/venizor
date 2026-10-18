import { ExperienceProvider } from "@/components/experience";
import { PageFooter, PageHeader } from "@/components/page-nav";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
export default function CareersPage() {
  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <PageHeader />
        <main className="inner-page-main" id="main">
          <section className="page-hero page-container">
            <span className="section-kicker">PEOPLE & COLLABORATION</span>
            <h1 className="page-hero-title">
              Good work starts
              <br />
              <span className="hero-title-blue">with curious people.</span>
            </h1>
            <p className="page-hero-lead">
              Interested in building useful software with VENIZOR? Tell us about
              your experience, the work you enjoy and a project you are proud
              of.
            </p>
            <Link
              href="mailto:info@venizor.com?subject=Collaboration%20with%20VENIZOR"
              className="pill-button dark"
            >
              Introduce yourself <ArrowUpRight size={17} />
            </Link>
          </section>
          <section className="service-method page-container">
            <span className="section-kicker">HOW WE THINK ABOUT THE WORK</span>
            <div className="service-process-grid">
              <div>
                <h2>Clear thinking</h2>
                <p>
                  Ask useful questions, understand the context and make
                  trade-offs visible.
                </p>
              </div>
              <div>
                <h2>Considered craft</h2>
                <p>
                  Care about the details people use and the systems other people
                  maintain.
                </p>
              </div>
              <div>
                <h2>Shared learning</h2>
                <p>
                  Review working software, share evidence and improve from what
                  you learn.
                </p>
              </div>
            </div>
            <p className="service-scope-note">
              Confirmed openings, responsibilities, locations and compensation
              will be published when available. An introduction is an expression
              of interest, not an application to an advertised vacancy.
            </p>
          </section>
        </main>
        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
