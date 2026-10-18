import { ContactChannels } from "@/components/contact-channels";
import {
ContactStudioMark,
InteractiveContactForm,
StudioLiveClock,
} from "@/components/contact-form";
import { ExperienceProvider,Reveal } from "@/components/experience";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { PageFooter,PageHeader } from "@/components/page-nav";
import { pageMetadata } from "@/lib/metadata";
import { ArrowDown,ArrowUpRight,Mail,ShieldCheck } from "lucide-react";

export const metadata = pageMetadata("/contact");
const faqs = [
  {
    q: "What should I include in a project brief?",
    a: "Tell us about the people who will use the product, the work you want to improve and any timing or technical constraints. A short starting point is enough.",
  },
  {
    q: "Can we agree an NDA before sharing sensitive details?",
    a: "Please ask before sending confidential material. Confidentiality arrangements can be discussed and agreed in writing.",
  },
  {
    q: "How are scope, budget and timing agreed?",
    a: "We review the requirements and dependencies, then prepare a proposal with scope, deliverables and an estimated timeline. Commitments are agreed in the project contract.",
  },
  {
    q: "Do you work remotely?",
    a: "Yes. Communication windows, review meetings and collaboration tools are agreed with each project team.",
  },
];

export default function ContactPage() {
  return (
    <ExperienceProvider>
      <div className="inner-page-shell contact-page" id="top">
        <a className="skip-link" href="#contact-main">
          Skip to content
        </a>
        <BreadcrumbJsonLd path="/contact" />
        <PageHeader activePage="contact" />
        <main id="contact-main" className="inner-page-main">
          <section
            className="contact-opening page-container"
            aria-labelledby="contact-hero-title"
          >
            <div className="section-topline">
              <span className="section-kicker">
                CONTACT / A GOOD PLACE TO START
              </span>
              <span className="section-kicker">
                INDEPENDENT THINKING. SHARED AMBITION.
              </span>
            </div>
            <div className="contact-opening-grid">
              <Reveal>
                <h1 id="contact-hero-title" className="page-hero-title">
                  Good things
                  <br />
                  <span>start with hello.</span>
                </h1>
                <p className="contact-opening-lead">
                  A new idea. A better way of working.
                  <br />
                  Let’s see what we can build together.
                </p>
                <a href="#project-brief" className="text-link">
                  Tell us about your project <ArrowDown size={17} />
                </a>
              </Reveal>
              <ContactStudioMark />
            </div>
          </section>
          <section
            className="contact-workspace page-container"
            id="project-brief"
            aria-label="Project enquiry form and contact details"
          >
            <aside className="contact-editorial-sidebar">
              <Reveal>
                <span className="section-kicker">
                  A CONVERSATION, NOT A COMMITMENT
                </span>
                <h2>
                  Your next chapter
                  <br />
                  starts here.
                </h2>
                <p>
                  Share what you have in mind. We’ll work through the questions,
                  possibilities and practical next steps.
                </p>
                <a
                  className="contact-email-link"
                  href="mailto:info@venizor.com"
                >
                  <Mail size={18} />
                  <span>info@venizor.com</span>
                  <ArrowUpRight size={17} />
                </a>
              </Reveal>
              <div className="contact-location">
                <StudioLiveClock />
                <ContactChannels />
              </div>
              <div className="contact-confidential">
                <ShieldCheck size={19} />
                <p>
                  Have something sensitive to discuss? Ask about an NDA before
                  sharing confidential details.
                </p>
              </div>
            </aside>
            <Reveal className="contact-form-reveal" delay={0.12}>
              <InteractiveContactForm />
            </Reveal>
          </section>
          <section
            className="contact-next page-container"
            aria-labelledby="next-steps-title"
          >
            <div className="contact-next-heading">
              <span className="section-kicker">WHAT HAPPENS NEXT</span>
              <h2 id="next-steps-title">
                A clear way
                <br />
                forward.
              </h2>
            </div>
            <div className="contact-next-steps">
              {[
                {
                  title: "We understand the idea.",
                  text: "We review your goals, constraints and the work you want to make better.",
                },
                {
                  title: "We have a conversation.",
                  text: "Together, we explore the important questions, the possible approaches and what to focus on first.",
                },
                {
                  title: "We agree the next step.",
                  text: "If there is a fit, we outline the scope, deliverables and commercial terms before work starts.",
                },
              ].map((step, i) => (
                <Reveal key={step.title} delay={i * 0.08}>
                  <span className="contact-step-number">0{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Reveal>
              ))}
            </div>
          </section>
          <section
            className="contact-questions page-container"
            aria-labelledby="faq-title"
          >
            <Reveal>
              <span className="section-kicker">BEFORE WE SAY HELLO</span>
              <h2 id="faq-title">A few useful answers.</h2>
            </Reveal>
            <div className="faq-stack">
              {faqs.map((faq, i) => (
                <details key={faq.q} className="faq-item">
                  <summary>
                    <span className="faq-number">0{i + 1}</span>
                    {faq.q}
                  </summary>
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
