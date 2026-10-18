import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { ExperienceProvider } from "@/components/experience";
import { CursorFollower } from "@/components/motion-details";
import { ScrollDirection } from "@/components/scroll-direction";
import { PageHeader, PageFooter } from "@/components/page-nav";
import { InteractiveContactForm, StudioLiveClock } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — Start a Project with VENIZOR Studio",
  description:
    "Get in touch with VENIZOR. Share your project vision, request a free technical consultation, or discuss your upcoming web, mobile, SaaS, or AI initiative.",
};

const faqs = [
  {
    q: "How fast will we receive a response after submitting?",
    a: "We guarantee a personal response from a principal product architect within 24 business hours. We do not use automated sales queues; our senior engineering leads review your brief directly.",
  },
  {
    q: "Can we execute a Non-Disclosure Agreement (NDA) before sharing details?",
    a: "Absolutely. We routinely sign mutual NDAs before reviewing sensitive technical specifications, proprietary algorithms, or novel product concepts. Just mention it in your message or email us directly.",
  },
  {
    q: "How do your project engagement structures work?",
    a: "We offer both fixed-scope milestone deliverables (ideal for zero-to-one MVPs, product launches, or discrete re-architectures) and dedicated sprint pods (ideal for high-velocity teams scaling an existing platform).",
  },
  {
    q: "Do you work with clients across different time zones?",
    a: "Yes. Over 70% of our clients are based in the United States, Europe, the Middle East, and Asia-Pacific. Our team maintains synchronized overlap windows for daily standups, review demos, and real-time Slack/GitHub collaboration.",
  },
  {
    q: "What typical budget ranges do you support?",
    a: "Engagements typically range from focused tactical sprints ($5,000–$15,000 for specialized modules and MVPs) to comprehensive platform architectures ($15,000–$50,000+ for full-scale SaaS platforms and enterprise systems).",
  },
];

export default function ContactPage() {
  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <a className="skip-link" href="#contact-main">
          Skip to content
        </a>
        <CursorFollower />
        <PageHeader activePage="contact" />

        <main id="contact-main" className="inner-page-main">
          {/* Hero Section */}
          <section className="page-hero page-container" aria-labelledby="contact-hero-title">
            <div className="page-hero-kicker">
              <span className="kicker-tag">
                <i className="live-dot" /> 01 / GET IN TOUCH
              </span>
              <span>OPEN FOR NEW CLIENT PARTNERSHIPS &amp; DISCOVERY</span>
            </div>

            <h1 id="contact-hero-title" className="page-hero-title">
              Something great <br />
              <span className="hero-title-blue">starts with hello.</span>
            </h1>

            <p className="page-hero-lead">
              Have an ambitious vision, a tricky technical bottleneck, or an idea on a napkin?
              We’d love to hear it. Fill out the brief below or reach out directly.
            </p>
          </section>

          {/* Form & Sidebar Grid */}
          <section className="contact-layout-grid page-container" aria-label="Project enquiry form and contact details">
            {/* Form Column */}
            <div>
              <InteractiveContactForm />
            </div>

            {/* Sidebar Column */}
            <aside className="contact-sidebar" aria-label="Studio contact info">
              {/* Live Clock Card */}
              <StudioLiveClock />

              {/* Direct Channels */}
              <div className="sidebar-info-card">
                <span className="sidebar-kicker">DIRECT COMMUNICATION</span>
                <h4>Studio Inquiries</h4>
                <p>
                  Prefer writing directly from your email client or have an existing RFP/spec?
                </p>
                <a
                  href="mailto:info@venizor.com"
                  className="sidebar-link-btn"
                >
                  <Mail size={16} /> info@venizor.com <ArrowUpRight size={14} />
                </a>
              </div>

              {/* Global Overlap */}
              <div className="sidebar-info-card">
                <span className="sidebar-kicker">GLOBAL COLLABORATION</span>
                <h4>Worldwide Reach</h4>
                <p>
                  Headquartered in India with seamless remote delivery across US, UK, European,
                  and Asian timezones.
                </p>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "12px", color: "var(--muted)" }}>
                  <ShieldCheck size={16} style={{ color: "var(--blue)" }} />
                  <span>Mutual NDA protected by default</span>
                </div>
              </div>
            </aside>
          </section>

          {/* What Happens Next Steps */}
          <section className="contact-process-section page-container" aria-labelledby="next-steps-title">
            <h3 id="next-steps-title">What happens after you reach out</h3>

            <div className="process-steps-grid">
              <div className="contact-step-box">
                <span className="step-num-pill">STEP 01</span>
                <h4>Initial Technical Review</h4>
                <p>
                  Within 24 hours, our engineering leads evaluate your requirements, assess technical feasibility, and prepare clarifying notes.
                </p>
              </div>

              <div className="contact-step-box">
                <span className="step-num-pill">STEP 02</span>
                <h4>30-Min Discovery Session</h4>
                <p>
                  A focused conversation to align on domain challenges, architectural trade-offs, target timelines, and budget expectations.
                </p>
              </div>

              <div className="contact-step-box">
                <span className="step-num-pill">STEP 03</span>
                <h4>Actionable Blueprint &amp; Proposal</h4>
                <p>
                  You receive an unambiguous proposal detailing development milestones, sprint deliverables, and fixed-price guarantees.
                </p>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section className="contact-faq-section page-container" aria-labelledby="faq-title">
            <h3 id="faq-title">Frequently asked questions</h3>

            <div className="faq-stack">
              {faqs.map((faq) => (
                <details key={faq.q} className="faq-item">
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>

        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
