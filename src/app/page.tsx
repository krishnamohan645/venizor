import Link from "next/link";
import { ArrowDown, ArrowUpRight, Asterisk, Plus } from "lucide-react";
import {
  ContactButton,
  DetailButton,
  ExperienceProvider,
  Reveal,
} from "@/components/experience";
import {
  ExpandingServices,
  HeroScene,
  IndustryPlayground,
  ProjectSlider,
  ScrollTimeline,
  ShaderFooter,
  StudioHeader,
  StudioIntro,
} from "@/components/studio-experience";
import { ScrollDirection, ScrollWords } from "@/components/scroll-direction";
import {
  CursorFollower,
  HeroWordsCycle,
  ProductMotion,
} from "@/components/motion-details";

const perspectives = [
  {
    category: "PRODUCT THINKING",
    title: "The best products start with a better question.",
    text: "Before choosing a framework or adding AI, understand the work people are trying to do. Talk to the team, identify friction, and agree on a better outcome. A focused first release gives you something useful to learn from.",
  },
  {
    category: "PRACTICAL INTELLIGENCE",
    title: "Make space for the work that matters.",
    text: "Automation works well when a repetitive workflow has clear inputs and outputs. Keep a person involved wherever judgment matters, and make it easy to review, correct, or stop an action. Measure time saved and quality together.",
  },
];

export default function Home() {
  return (
    <ExperienceProvider>
      <div className="studio-site" id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <StudioIntro />
        <ScrollDirection />
        <CursorFollower />
        <StudioHeader />
        <main id="main">
          <section className="studio-hero" aria-labelledby="hero-title">
            <div className="hero-topline">
              <span>
                <i className="live-dot" /> INDEPENDENT THINKING. CONNECTED
                POSSIBILITIES.
              </span>
              <span>TECHNOLOGY & DIGITAL INNOVATION STUDIO</span>
            </div>
            <div className="hero-editorial">
              <h1 id="hero-title">
                <span className="hero-title-line">
                  <span className="hero-title-inner">Vision meets</span>
                </span>
                <span className="hero-title-line">
                  <span className="hero-title-inner hero-title-blue">
                    <HeroWordsCycle />
                  </span>
                </span>
              </h1>
              <div className="hero-editorial-aside">
                <p>
                  We build products.
                  <br />
                  Engineer solutions.
                  <br />
                  And automate what’s next.
                </p>
                <ContactButton className="pill-button dark">
                  Discuss your project <ArrowUpRight size={18} />
                </ContactButton>
              </div>
            </div>
            <HeroScene />
            <div className="hero-footline">
              <span>STRATEGY. DESIGN. TECHNOLOGY. ALL TOGETHER.</span>
              <a href="#about">
                A different kind of technology partner <ArrowDown size={14} />
              </a>
            </div>
          </section>

          <section
            className="studio-about page-container section-padding"
            id="about"
            aria-labelledby="about-title"
          >
            <div className="section-side-label">
              <span className="section-kicker">01 / MEET VENIZOR</span>
              <span className="cross-mark" aria-hidden="true">
                <Plus size={32} strokeWidth={1} />
              </span>
            </div>
            <Reveal className="about-statement">
              <ScrollWords
                id="about-title"
                lines={[
                  "Big-picture thinkers.",
                  "Detail-obsessed builders.",
                  "Your next chapter starts here.",
                ]}
              />
              <div className="about-statement-bottom">
                <p>
                  We’re a technology and digital innovation studio connecting
                  clear thinking, considered design, and careful engineering.
                  From an ambitious first idea to the systems that run your
                  business, we help move things forward.
                </p>
                <a
                  className="circle-link"
                  href="#services"
                  aria-label="Explore our capabilities"
                >
                  <ArrowDown size={25} />
                </a>
              </div>
            </Reveal>
          </section>

          <section
            className="capabilities page-container section-padding"
            id="services"
            aria-labelledby="services-title"
          >
            <div className="section-head">
              <span className="section-kicker">02 / WHAT WE BRING</span>
              <div>
                <h2 id="services-title">
                  Good ideas deserve
                  <br />
                  great execution.
                </h2>
                <p>
                  One connected team. From the first sketch
                  <br className="desktop-break" /> to the next big thing.
                </p>
              </div>
              <span className="section-count">(08)</span>
            </div>
            <ExpandingServices />
          </section>

          <section
            className="selected-work section-padding"
            id="work"
            aria-labelledby="work-title"
          >
            <div className="page-container">
              <div className="section-head">
                <span className="section-kicker">
                  03 / POSSIBILITIES IN PRACTICE
                </span>
                <div>
                  <h2 id="work-title">
                    Made to make
                    <br />
                    <span>a difference.</span>
                  </h2>
                  <p>
                    Digital concept explorations. Different challenges.
                    <br className="desktop-break" /> The same care in every
                    detail.
                  </p>
                </div>
                <span className="section-count">(04)</span>
              </div>
              <ProjectSlider />
            </div>
          </section>

          <section
            className="product-section section-padding"
            id="products"
            aria-labelledby="products-title"
          >
            <div className="page-container">
              <div className="product-section-heading">
                <span className="section-kicker">
                  04 / OUR OWN NEXT CHAPTER
                </span>
                <h2 id="products-title">
                  Innovate faster.
                  <br />
                  Work smarter.
                </h2>
                <div>
                  <p>
                    Alongside our client work, we’re building SaaS and AI
                    products that make everyday business feel a little more
                    effortless.
                  </p>
                  <DetailButton
                    className="pill-button dark"
                    title="A smarter way to work is taking shape."
                    description="Our SaaS and AI product portfolio is in development. We’re focused on practical tools for real business challenges, and we’d love to hear what your team needs."
                    features={[
                      "Approachable software for everyday work",
                      "Practical AI and connected workflows",
                      "In development · Ask about early access",
                    ]}
                  >
                    Explore our products <ArrowUpRight size={18} />
                  </DetailButton>
                </div>
              </div>
              <ProductMotion>
                <div className="product-bento">
                  <Reveal className="bento-main">
                    <span className="bento-index">01 / BUILT TO EVOLVE</span>
                    <h3>
                      More possibility.
                      <br />
                      Less complexity.
                    </h3>
                    <p>
                      Thoughtful tools that grow
                      <br />
                      with the way you work.
                    </p>
                    <div className="product-ribbons" aria-hidden="true">
                      {Array.from({ length: 9 }, (_, index) => (
                        <i
                          key={index}
                          style={
                            { "--ribbon-index": index } as React.CSSProperties
                          }
                        />
                      ))}
                    </div>
                    <span className="bento-plus" aria-hidden="true">
                      <Plus size={23} />
                    </span>
                  </Reveal>
                  <div className="bento-side">
                    <Reveal className="bento-small automation-bento">
                      <span className="bento-index">02 / CONNECT THE DOTS</span>
                      <h3>
                        Let things
                        <br />
                        flow naturally.
                      </h3>
                      <div className="mini-flow" aria-hidden="true">
                        <span>
                          <Plus size={19} />
                        </span>
                        <i />
                        <span>
                          <Asterisk size={24} />
                        </span>
                        <i />
                        <span>
                          <ArrowUpRight size={23} />
                        </span>
                      </div>
                      <p>
                        Practical intelligence.
                        <br />
                        Fewer repetitive tasks.
                      </p>
                    </Reveal>
                    <Reveal className="bento-small clarity-bento">
                      <span className="bento-index">03 / SEE WHAT MATTERS</span>
                      <h3>
                        A clearer
                        <br />
                        perspective.
                      </h3>
                      <div className="clarity-orb" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </div>
                      <p>
                        Less noise.
                        <br />
                        More meaningful decisions.
                      </p>
                    </Reveal>
                  </div>
                </div>
              </ProductMotion>
              <p className="product-development-note">
                <span className="live-dot" /> Products currently in development.
                Built with purpose, never rushed.
              </p>
            </div>
          </section>

          <section
            className="studio-process page-container section-padding"
            id="process"
            aria-label="Our collaborative process"
          >
            <ScrollTimeline />
          </section>

          <section
            className="industry-section section-padding"
            id="industries"
            aria-labelledby="industry-title"
          >
            <div className="page-container">
              <div className="industry-section-heading">
                <span className="section-kicker">BUILT FOR YOUR WORLD</span>
                <h2 id="industry-title">
                  Every industry.
                  <br />
                  <span>A new possibility.</span>
                </h2>
                <p>
                  Different challenges need fresh perspectives.
                  <br />
                  We bring curiosity, experience, and the right tools.
                </p>
              </div>
              <IndustryPlayground />
            </div>
          </section>

          <section
            className="perspectives page-container section-padding"
            id="insights"
            aria-labelledby="insights-title"
          >
            <div className="section-head">
              <span className="section-kicker">A LITTLE PERSPECTIVE</span>
              <h2 id="insights-title">Thinking out loud.</h2>
              <span className="section-count">(02)</span>
            </div>
            <div className="perspective-grid">
              {perspectives.map((item, index) => (
                <DetailButton
                  className="perspective-card"
                  key={item.title}
                  title={item.title}
                  description={item.text}
                >
                  <span className="perspective-meta">
                    0{index + 1} / {item.category}
                  </span>
                  <h3>{item.title}</h3>
                  <span className="perspective-bottom">
                    Read the perspective <ArrowUpRight size={22} />
                  </span>
                </DetailButton>
              ))}
            </div>
          </section>
        </main>

        <footer className="studio-footer" id="contact">
          <ShaderFooter />
          <div className="footer-content page-container">
            <div className="footer-top">
              <span className="section-kicker">YOUR NEXT CHAPTER</span>
              <span>
                <i className="live-dot" /> OPEN TO GOOD CONVERSATIONS
              </span>
            </div>
            <div className="footer-invitation">
              <h2>
                Something great
                <br />
                starts with <em>hello.</em>
              </h2>
              <ContactButton className="footer-contact-circle">
                <ArrowUpRight size={48} strokeWidth={1.15} />
                <span>LET’S MAKE IT HAPPEN</span>
              </ContactButton>
            </div>
            <div className="footer-connect">
              <a href="mailto:info@venizor.com">
                info@venizor.com <ArrowUpRight size={20} />
              </a>
              <Link href="/contact" className="text-link">
                Direct contact &amp; enquiries <ArrowUpRight size={18} />
              </Link>
              <span>BASED IN INDIA. BUILDING FOR THE WORLD.</span>
            </div>
            <div className="footer-nav">
              <a href="#about">Studio</a>
              <Link href="/about">Who we are</Link>
              <a href="#services">Services</a>
              <a href="#work">Our work</a>
              <a href="#products">Products</a>
              <a href="#insights">Insights</a>
              <Link href="/blog">Blog &amp; Field Notes</Link>
              <Link href="/playbook">Stack Playbook</Link>
              <Link href="/simulator">Pipeline Simulator</Link>
              <Link href="/case-studies">Case Studies</Link>
              <Link href="/tools">Developer Tools</Link>
              <Link href="/scope">Scope Wizard</Link>
              <Link href="/contact">Contact us</Link>
              <a href="#top" className="footer-back-top">
                Back to top <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="footer-wordmark" aria-label="VENIZOR">
              VENIZOR<span>®</span>
            </div>
            <div className="footer-bottom">
              <span>© 2026 VENIZOR. INNOVATE WITH CONFIDENCE.</span>
              <div>
                <DetailButton
                  className="legal-link"
                  title="Privacy"
                  description="This website does not use advertising cookies or collect form submissions on a server. Project enquiries are prepared in your email application and are only sent when you choose to send them. Your email provider’s privacy terms apply."
                >
                  Privacy
                </DetailButton>
                <DetailButton
                  className="legal-link"
                  title="Website terms"
                  description="The work shown includes illustrative concept demonstrations. Product information describes development plans. Project scope, fees, timelines, and service terms are agreed separately in writing."
                >
                  Terms
                </DetailButton>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ExperienceProvider>
  );
}
