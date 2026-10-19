"use client";
import { IndustryArt } from "./industry-art";
import { SectionIllustration } from "./section-illustration";
import { ScrollProjectGallery } from "./scroll-project-gallery";
import { OptionalFeatureBoundary } from "./optional-feature-boundary";

import { services } from "@/data/services";
import { scrollPageTo } from "@/lib/smooth-scroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  ChartNoAxesCombined,
  Check,
  CodeXml,
  Layers3,
  Menu,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ContactButton, DetailButton, useExperienceDialog } from "./experience";

const navItems = [
  ["Studio", "about"],
  ["Services", "services"],
  ["Work", "work"],
  ["Products", "products"],
];

export function StudioHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useExperienceDialog();
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <header className="studio-header">
      <a className="brand-logo" href="#top" aria-label="VENIZOR home">
        <Image
          src="/logo.svg"
          width={1020}
          height={250}
          sizes="(max-width: 640px) 155px, 190px"
          alt="VENIZOR — Innovate with confidence"
          preload
        />
      </a>
      <nav
        id="studio-navigation"
        className={`studio-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        {navItems.map(([label, id], index) => (
          <a
            key={id}
            href={id === "services" ? "/services" : `#${id}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
            <sup>0{index + 1}</sup>
          </a>
        ))}
        <Link href="/about" onClick={() => setMenuOpen(false)}>
          Who we are
          <sup>05</sup>
        </Link>
        <Link href="/blog" onClick={() => setMenuOpen(false)}>
          Blog
          <sup>06</sup>
        </Link>
        <a
          className="mobile-contact"
          href="/contact"
          onClick={() => setMenuOpen(false)}
        >
          Contact Us
          <ArrowUpRight size={16} />
        </a>
      </nav>
      <div className="studio-header-actions">
        <button
          className="icon-button search-button"
          aria-label="Search site"
          onClick={() => dialog({ type: "search" })}
        >
          <Search size={18} />
        </button>
        <ContactButton className="pill-button dark header-contact">
          Let’s talk <ArrowUpRight size={16} />
        </ContactButton>
        <button
          ref={menuButton}
          className="icon-button menu-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="studio-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
    </header>
  );
}

export function StudioIntro() {
  const overlay = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let played = false;
      try {
        played = sessionStorage.getItem("venizor-intro-v3") === "seen";
      } catch {
        /* Storage is optional. */
      }
      const entrance = gsap.timeline();
      if (!played) {
        entrance
          .set(overlay.current, { visibility: "visible", opacity: 1 })
          .fromTo(
            ".intro-word",
            { yPercent: 110 },
            { yPercent: 0, stagger: 0.055, duration: 0.4, ease: "power3.out" },
          )
          .to(
            overlay.current,
            { yPercent: -100, duration: 0.6, ease: "power3.inOut" },
            "+=.1",
          )
          .set(overlay.current, { visibility: "hidden" })
          .call(() => {
            try {
              sessionStorage.setItem("venizor-intro-v3", "seen");
            } catch {
              /* Storage is optional. */
            }
          });
      }
      entrance
        .from(
          ".hero-title-inner",
          {
            yPercent: 100,
            rotation: 1.5,
            opacity: 0,
            stagger: 0.075,
            duration: 0.7,
            ease: "power3.out",
          },
          played ? 0 : "-=.3",
        )
        .from(
          ".hero-editorial-aside, .hero-topline",
          {
            y: 18,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=.45",
        )
        .from(
          ".mosaic-tile",
          {
            y: 40,
            opacity: 0,
            scale: 0.95,
            stagger: { amount: 0.35, from: "center" },
            duration: 0.65,
            ease: "power3.out",
          },
          "-=.35",
        );
    });
    return () => media.revert();
  }, []);
  return (
    <div ref={overlay} className="studio-intro" aria-hidden="true">
      <span className="intro-brand">VENIZOR®</span>
      <div className="intro-words">
        <span>
          <i className="intro-word">Think.</i>
        </span>
        <span>
          <i className="intro-word">Build.</i>
        </span>
        <span>
          <i className="intro-word">Evolve.</i>
        </span>
      </div>
      <span className="intro-bottom">INNOVATE WITH CONFIDENCE</span>
    </div>
  );
}

export function HeroScene() {
  const scene = useRef<HTMLDivElement>(null);
  const pointerLight = useRef<HTMLDivElement>(null);
  const pointer = useRef<{
    x: (value: number) => void;
    y: (value: number) => void;
    opacity: (value: number) => void;
  } | null>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const inView = useInView(scene);
  const tileAnimation = useRef<gsap.core.Timeline | null>(null);
  const { scrollYProgress } = useScroll({
    target: scene,
    offset: ["start end", "end start"],
  });
  const y = useMotionValue("0%");
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!reduced && !paused) y.set(`${(progress - 0.5) * 10}%`);
  });
  useEffect(() => {
    if (reduced || paused) y.set("0%");
  }, [reduced, paused, y]);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const light = pointerLight.current;
        if (!light || paused) return;
        pointer.current = {
          x: gsap.quickTo(light, "x", { duration: 0.28, ease: "power3.out" }),
          y: gsap.quickTo(light, "y", { duration: 0.28, ease: "power3.out" }),
          opacity: gsap.quickTo(light, "opacity", {
            duration: 0.2,
            ease: "power2.out",
          }),
        };
        return () => {
          pointer.current = null;
        };
      },
    );
    return () => media.revert();
  }, [paused]);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        tileAnimation.current = gsap.timeline({
          repeat: -1,
          repeatRefresh: true,
          repeatDelay: 1.1,
          delay: 1.8,
        });
        tileAnimation.current.to(".mosaic-tile:nth-child(3n + 1) i", {
          rotation: "+=90",
          duration: 1.3,
          stagger: 0.055,
          ease: "power2.inOut",
        });
        tileAnimation.current.to(
          ".mosaic-tile:nth-child(3n + 2) i",
          {
            rotation: "-=90",
            duration: 1.2,
            stagger: 0.04,
            ease: "power2.inOut",
          },
          "-=.4",
        );
        tileAnimation.current.to(
          ".mosaic-tile:nth-child(4n) i",
          {
            scale: 0.68,
            duration: 0.75,
            stagger: 0.09,
            repeat: 1,
            yoyo: true,
            ease: "sine.inOut",
          },
          "-=.35",
        );
      },
      scene,
    );
    return () => media.revert();
  }, []);
  useEffect(() => {
    tileAnimation.current?.paused(paused || !inView);
    scene.current
      ?.closest("section")
      ?.setAttribute("data-motion-paused", String(paused));
  }, [paused, inView]);
  return (
    <div
      className="hero-sculpture"
      ref={scene}
      onPointerMove={(event) => {
        if (!pointer.current || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        pointer.current.x(event.clientX - box.left);
        pointer.current.y(event.clientY - box.top);
        pointer.current.opacity(1);
      }}
      onPointerLeave={() => pointer.current?.opacity(0)}
    >
      <div
        ref={pointerLight}
        className="hero-pointer-light"
        aria-hidden="true"
      />
      <motion.div className="hero-mosaic" style={{ y }} aria-hidden="true">
        {Array.from({ length: 36 }, (_, index) => (
          <div className={`mosaic-tile mosaic-${index % 12}`} key={index}>
            <i />
          </div>
        ))}
      </motion.div>
      <div className="sculpture-label">
        <span className="micro-label">THE SHAPE OF WHAT’S NEXT</span>
        <p>
          Good thinking.
          <br />
          Real impact.
        </p>
      </div>
      <div className="sculpture-bottom">
        <span>DESIGN × ENGINEERING × INTELLIGENCE</span>
        <button
          className="motion-toggle"
          onClick={() => setPaused(!paused)}
          aria-label={
            paused ? "Play artwork animation" : "Pause artwork animation"
          }
        >
          {paused ? "Play motion" : "Pause motion"}
          <span>{paused ? "▷" : "Ⅱ"}</span>
        </button>
      </div>
      <a
        href="#about"
        className="sculpture-scroll"
        aria-label="Explore the studio"
      >
        <ArrowDown size={22} />
      </a>
    </div>
  );
}

const serviceGroups = [
  {
    title: "Digital experiences",
    number: "01",
    summary: "Built to feel right. Engineered to perform.",
    description:
      "From your first impression to your everyday interactions, we bring clarity, character, and purpose to every screen.",
    tags: [
      "Website development",
      "Web applications",
      "Mobile applications",
      "UX & UI design",
    ],
    icon: CodeXml,
    art: "experience",
    features: [
      "Brand-led websites and responsive experiences",
      "Scalable web and mobile applications",
      "Accessibility, performance, and thoughtful interactions",
    ],
  },
  {
    title: "Web applications",
    number: "02",
    icon: Layers3,
    art: "products",
    summary: "Complex work. Beautifully simple software.",
    description:
      "Bring your operations into one connected workspace. We design and build fast, dependable applications around the way your team actually works.",
    tags: [
      "Business platforms",
      "Customer portals",
      "Dashboards",
      "API integrations",
    ],
    features: [
      "Product discovery and user journeys",
      "Responsive applications and connected data",
      "Reliable architecture, testing, and ongoing improvement",
    ],
  },
  {
    title: "Mobile applications",
    number: "03",
    icon: Smartphone,
    art: "experience",
    summary: "A small screen. An exceptional experience.",
    description:
      "Put the useful things within reach. Thoughtful mobile experiences that connect your business with people wherever their day takes them.",
    tags: ["iOS & Android", "Cross-platform", "Mobile UX", "App integrations"],
    features: [
      "Native-feeling mobile interactions",
      "Accessible flows and purposeful notifications",
      "Release preparation and continuous product improvement",
    ],
  },
  {
    title: "AI & automation",
    number: "04",
    summary: "Less busywork. More room for better ideas.",
    description:
      "Useful intelligence, connected systems, and workflows that give your team time to do the work that matters.",
    tags: [
      "AI integrations",
      "Workflow automation",
      "Intelligent assistants",
      "Connected tools",
    ],
    icon: Sparkles,
    art: "intelligence",
    features: [
      "Workflow discovery and practical AI strategy",
      "Connected business tools and intelligent assistants",
      "Human oversight at the moments that matter",
    ],
  },
  {
    title: "Products & platforms",
    number: "05",
    summary: "From a good idea to an essential product.",
    description:
      "We connect product thinking with careful engineering to build software around real problems and real people.",
    tags: [
      "SaaS development",
      "Custom software",
      "Product strategy",
      "System architecture",
    ],
    icon: Layers3,
    art: "products",
    features: [
      "Product discovery, prototyping, and validation",
      "Purpose-built software and SaaS platforms",
      "Maintainable systems that evolve with your business",
    ],
  },
  {
    title: "Digital marketing",
    number: "06",
    summary: "Make your next chapter your strongest one.",
    description:
      "Bring your business into focus with a considered approach to content, search, and digital marketing.",
    tags: ["Digital marketing", "SEO & AEO", "Content strategy", "Analytics"],
    icon: ArrowUpRight,
    art: "growth",
    features: [
      "Technical search and answer-engine foundations",
      "Content strategy and digital campaigns",
      "Clear measurement and continuous improvement",
    ],
  },
  {
    title: "Search engine optimization",
    number: "07",
    icon: Search,
    art: "experience",
    summary: "Be found by the people who need you.",
    description:
      "A solid technical foundation, helpful content, and a clearer path from search to your business. We make organic visibility part of the experience.",
    tags: [
      "Technical SEO",
      "Content strategy",
      "Local search",
      "Search analytics",
    ],
    features: [
      "Crawlability, performance, and structured data",
      "Search intent and content planning",
      "Measurement and continuous optimization",
    ],
  },
  {
    title: "Answer engine optimization",
    number: "08",
    icon: ChartNoAxesCombined,
    art: "intelligence",
    summary: "Clear answers. A more discoverable business.",
    description:
      "Help people and answer engines understand what makes your business useful. We structure accurate, authoritative content for an evolving search landscape.",
    tags: ["AEO", "Structured content", "Entity clarity", "Helpful answers"],
    features: [
      "Content audits and clear business information",
      "Question-led content and appropriate schema",
      "Visibility monitoring without promises of placement",
    ],
  },
];

export function ExpandingServices() {
  const [active, setActive] = useState<number | null>(0);
  useEffect(() => {
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 550);
    return () => window.clearTimeout(refresh);
  }, [active]);
  return (
    <div className="expanding-services">
      {serviceGroups.map((service, index) => (
        <article
          className={`service-row ${active === index ? "active" : ""}`}
          key={service.title}
          onPointerMove={(e) => {
            if (
              e.pointerType !== "touch" &&
              window.matchMedia("(hover: hover)").matches
            )
              setActive(index);
          }}
        >
          <button
            className="service-row-heading"
            aria-expanded={active === index}
            aria-controls={`service-panel-${index}`}
            onClick={(event) => {
              if (
                event.detail > 0 &&
                window.matchMedia("(hover: hover)").matches
              ) {
                setActive(index);
              } else {
                setActive(active === index ? null : index);
              }
            }}
          >
            <span className="row-number">/{service.number}</span>
            <h3>{service.title}</h3>
            <span className="row-toggle">
              {active === index ? <Minus size={23} /> : <Plus size={23} />}
            </span>
          </button>
          <div
            className="service-panel"
            id={`service-panel-${index}`}
            inert={active !== index}
            aria-hidden={active !== index}
          >
            <div className="service-panel-inner">
              <div
                className={`service-art service-art-${service.art}`}
                aria-hidden="true"
              >
                <SectionIllustration
                  kind={
                    (
                      [
                        "architecture",
                        "operations",
                        "payments",
                        "retrieval",
                        "vision",
                        "discovery",
                        "data",
                        "intelligence",
                      ] as const
                    )[index]
                  }
                />
                <span>{service.number} / VENIZOR</span>
              </div>
              <div className="service-description">
                <p className="service-summary">{service.summary}</p>
                <p>{service.description}</p>
                <div className="service-tags">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link
                  className="text-link"
                  href={`/services/${services[index].slug}`}
                >
                  Explore this service <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
      <div className="service-small-print">
        <span>Have something more specific in mind?</span>
        <DetailButton
          className="text-link"
          title="Website Development"
          description="A website should bring your brand into focus and make the next step feel effortless. We combine expressive design with solid engineering to create fast, responsive websites."
          features={[
            "Brand and experience design",
            "Responsive development",
            "Performance and accessibility",
          ]}
        >
          Website Development <ArrowUpRight size={15} />
        </DetailButton>
        <ContactButton className="text-link">
          Let’s find your solution <ArrowUpRight size={17} />
        </ContactButton>
      </div>
    </div>
  );
}

const projects = [
  {
    name: "Form & Field",
    type: "website" as const,
    tag: "BRAND EXPERIENCE / WEBSITE",
    title: "A considered space.\nA lasting impression.",
    description:
      "An editorial website concept for an architecture practice, balancing a strong sense of place with an effortless enquiry journey.",
    background: "sand",
    features: [
      "Brand-led editorial design",
      "Responsive architecture portfolio",
      "Illustrative concept · Not a delivered client project",
    ],
  },
  {
    name: "Orbit",
    type: "dashboard" as const,
    tag: "DIGITAL PRODUCT / PLATFORM",
    title: "Everything moving.\nOne clear picture.",
    description:
      "A business workspace concept that brings activity, reporting, and everyday decisions into one calm, useful interface.",
    background: "blue",
    features: [
      "An intuitive business overview",
      "Approachable data visualization",
      "Illustrative concept · Operations platform",
    ],
  },
  {
    name: "Everyday",
    type: "mobile" as const,
    tag: "MOBILE EXPERIENCE / FINTECH",
    title: "Small screen.\nA bigger perspective.",
    description:
      "A mobile finance concept built around everyday clarity, helping people understand their activity at a glance.",
    background: "lavender",
    features: [
      "A focused personal finance experience",
      "Accessible navigation and at-a-glance insights",
      "Illustrative concept · Mobile application",
    ],
  },
  {
    name: "Flowstate",
    type: "automation" as const,
    tag: "AI AUTOMATION / WORKFLOW",
    title: "Let the busywork\ntake care of itself.",
    description:
      "A connected workflow concept that helps teams qualify incoming enquiries while preserving human judgment.",
    background: "mint",
    features: [
      "AI-assisted lead qualification",
      "Human review at important decisions",
      "Illustrative concept · Workflow automation",
    ],
  },
];

export function ProjectSlider() {
  return <ScrollProjectGallery projects={projects} />;
}

const processSteps = [
  {
    title: "A good conversation.",
    name: "Discover",
    text: "We listen before we build. Your ambitions, your people, and the problem worth solving become our shared starting point.",
    outcome: "A clear brief. A shared ambition.",
    deliverables: [
      "Stakeholder conversations",
      "User needs & workflow mapping",
      "Project brief and success criteria",
    ],
  },
  {
    title: "A clear way forward.",
    name: "Define",
    text: "We connect the dots between business goals and user needs, then create a focused roadmap from first idea to first release.",
    outcome: "A product direction and practical plan.",
    deliverables: [
      "Experience map and wireframes",
      "Technical direction",
      "Prioritized release roadmap",
    ],
  },
  {
    title: "Make it feel inevitable.",
    name: "Create",
    text: "Design and engineering work together. We prototype, build, test, and refine with you, making the important details count.",
    outcome: "A working experience, thoughtfully crafted.",
    deliverables: [
      "Interactive prototypes",
      "Design and development reviews",
      "Accessibility and functional testing",
    ],
  },
  {
    title: "The beginning of better.",
    name: "Evolve",
    text: "Launch is a new starting line. We learn from real use and help you make the changes that keep your product moving forward.",
    outcome: "A confident launch. Room to grow.",
    deliverables: [
      "Launch preparation and handover",
      "Real-use feedback and measurement",
      "A plan for the next improvement",
    ],
  },
];

export function ScrollTimeline() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    let frame = 0;
    const readPosition = () => {
      frame = 0;
      if (!root.current) return;
      const bounds = root.current.getBoundingClientRect();
      if (bounds.top > window.innerHeight || bounds.bottom < 0) return;
      let next = 0;
      root.current
        .querySelectorAll<HTMLElement>(".timeline-step")
        .forEach((card, index) => {
          if (card.getBoundingClientRect().top <= window.innerHeight * 0.55)
            next = index;
        });
      setActive((current) => (current === next ? current : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(readPosition);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return (
    <div className="scroll-timeline" ref={root}>
      <div className="timeline-index">
        <span className="section-kicker">HOW WE GET THERE</span>
        <h2>
          Good work.
          <br />
          Great chemistry.
        </h2>
        <p>
          A clear process.
          <br />A genuinely shared journey.
        </p>
        <nav aria-label="Process steps">
          {processSteps.map((step, index) => (
            <a
              href={`#step-${index}`}
              key={step.name}
              className={active === index ? "active" : ""}
              aria-current={active === index ? "step" : undefined}
            >
              <span>0{index + 1}</span>
              {step.name}
              <ArrowUpRight size={16} />
            </a>
          ))}
        </nav>
        <div
          className="process-live"
          aria-label={`Current phase: ${processSteps[active].name}`}
        >
          <div className="process-route" aria-hidden="true">
            <i style={{ transform: `scaleX(${active / 3})` }} />
            {processSteps.map((step, index) => (
              <span key={step.name} data-complete={index <= active}>
                {index < active ? <Check size={12} /> : `0${index + 1}`}
              </span>
            ))}
          </div>
          <div className="process-phase-copy" key={active}>
            <span className="micro-label">PHASE 0{active + 1} / 04</span>
            <p>{processSteps[active].outcome}</p>
          </div>
        </div>
      </div>
      <div className="timeline-content">
        {processSteps.map((step, index) => (
          <article
            className={`timeline-step ${active === index ? "active" : ""}`}
            id={`step-${index}`}
            key={step.name}
            data-step={index}
          >
            <span className="timeline-step-number" aria-hidden="true">
              0{index + 1}
            </span>
            <div className="timeline-step-top">
              <span>
                0{index + 1} / {step.name.toUpperCase()}
              </span>
              <Plus size={21} />
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <div className="timeline-outcome">
              <Check size={17} />
              {step.outcome}
            </div>
            <details
              className="process-deliverables"
              onToggle={() => ScrollTrigger.refresh()}
            >
              <summary>
                What we work on together <Plus size={15} />
              </summary>
              <ul>
                {step.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}

const industryLabels = [
  "Technology & SaaS",
  "E-commerce",
  "Healthcare",
  "Education",
  "Real estate",
  "Professional services",
  "Logistics",
  "Your next big idea ↗",
];
const industrySolutions = [
  {
    title: "Ideas that become essential products.",
    description:
      "From a focused first release to a connected SaaS platform, give your users a product that makes complicated work feel simple.",
    tags: ["SaaS platforms", "Customer onboarding", "Product analytics"],
    example:
      "Connect onboarding, billing, and everyday workflows in one considered experience.",
  },
  {
    title: "A better journey from browse to buy.",
    description:
      "Bring your brand, storefront, and operations together. Make discovery effortless and the next purchase easier to manage.",
    tags: ["Online storefronts", "Inventory integrations", "Customer journeys"],
    example:
      "A storefront connected to stock, orders, and the team fulfilling them.",
  },
  {
    title: "More time for the people in your care.",
    description:
      "Clear digital experiences for patients and care teams, shaped around your workflows and information requirements.",
    tags: ["Patient experiences", "Appointment workflows", "Team portals"],
    example:
      "Simplify appointment enquiries and routine administration with clear human review.",
  },
  {
    title: "Make room for a little more discovery.",
    description:
      "Accessible learning experiences that help learners find their way and educators spend more time teaching.",
    tags: ["Learning platforms", "Enrollment journeys", "Student portals"],
    example:
      "Bring course discovery, applications, and learning resources into one useful place.",
  },
  {
    title: "Open the door to your next opportunity.",
    description:
      "Showcase places with character and give your team a clearer way to connect properties with the right people.",
    tags: ["Property experiences", "Listing platforms", "Enquiry automation"],
    example:
      "Turn property interest into organized enquiries and coordinated viewings.",
  },
  {
    title: "Your expertise. A stronger digital presence.",
    description:
      "Express the value of your work and make it easier for clients to start, collaborate, and stay connected.",
    tags: ["Brand websites", "Client portals", "Proposal workflows"],
    example:
      "Give clients one clear place for project updates, documents, and next steps.",
  },
  {
    title: "Keep every moving part connected.",
    description:
      "Help operations teams see what needs attention, connect information, and reduce repetitive coordination.",
    tags: [
      "Operations dashboards",
      "System integrations",
      "Workflow automation",
    ],
    example:
      "Connect incoming orders, operational updates, and exception handling in one workspace.",
  },
  {
    title: "A new challenge is a good place to start.",
    description:
      "Your business does not have to fit a category. Tell us what is getting in the way, and we will explore what better could look like.",
    tags: ["Discovery workshops", "Digital strategy", "Custom software"],
    example:
      "Start with a focused discovery session and leave with a practical direction.",
  },
];
type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
};
export function IndustryPlayground() {
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const dragging = useRef<{
    index: number;
    offsetX: number;
    offsetY: number;
    moved: boolean;
    lastX: number;
    lastY: number;
    lastTime: number;
  } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const reduced = useReducedMotion();
  const isInView = useInView(root, { margin: "100px", once: false });
  useEffect(() => {
    if (!root.current) return;
    let frame = 0;
    let previous = 0;
    const initialize = () => {
      const width = root.current!.clientWidth;
      const height = root.current!.clientHeight;
      const columns = width < 600 ? 2 : 4;
      bodies.current = industryLabels.map((_, index) => {
        const el = labels.current[index]!;
        return {
          x: Math.min(
            width - el.offsetWidth - 10,
            (index % columns) * (width / columns) + 12,
          ),
          y: 40 + Math.floor(index / columns) * 66,
          vx: reduced ? 0 : (index % 2 ? 1 : -1) * 1.3,
          vy: 0,
          width: el.offsetWidth,
          height: el.offsetHeight,
          rotation: ((index % 3) - 1) * 7,
        };
      });
      paint();
      if (reduced)
        bodies.current.forEach((body) => {
          body.y = Math.min(body.y, height - body.height);
        });
    };
    const paint = () =>
      bodies.current.forEach((body, index) => {
        const label = labels.current[index];
        if (label)
          label.style.transform = `translate3d(${body.x}px,${body.y}px,0) rotate(${body.rotation}deg)`;
      });
    const update = (now: number) => {
      const dt = previous ? Math.min((now - previous) / 16.67, 2) : 1;
      previous = now;
      const width = root.current!.clientWidth;
      const height = root.current!.clientHeight;
      if (!reduced) {
        for (let i = 0; i < bodies.current.length; i++) {
          const body = bodies.current[i];
          if (dragging.current?.index === i) continue;
          body.vy += 0.19 * dt;
          body.vx *= 0.995;
          body.x += body.vx * dt;
          body.y += body.vy * dt;
          if (body.y + body.height > height - 14) {
            body.y = height - body.height - 14;
            body.vy *= -0.42;
            body.vx *= 0.96;
            if (Math.abs(body.vy) < 0.3) body.vy = 0;
          }
          if (body.x < 10) {
            body.x = 10;
            body.vx = Math.abs(body.vx) * 0.5;
          }
          if (body.x + body.width > width - 10) {
            body.x = width - body.width - 10;
            body.vx = -Math.abs(body.vx) * 0.5;
          }
        }
        for (let i = 0; i < bodies.current.length; i++)
          for (let j = i + 1; j < bodies.current.length; j++) {
            const a = bodies.current[i],
              b = bodies.current[j];
            const overlapX =
              Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
            const overlapY =
              Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
            if (overlapX > 0 && overlapY > 0) {
              const aHeld = dragging.current?.index === i,
                bHeld = dragging.current?.index === j;
              const push = aHeld || bHeld ? 1 : 0.5;
              if (overlapY < overlapX) {
                const sign = a.y < b.y ? -1 : 1;
                if (!aHeld) {
                  a.y += sign * overlapY * push;
                  a.vy *= -0.15;
                }
                if (!bHeld) {
                  b.y -= sign * overlapY * push;
                  b.vy *= -0.15;
                }
              } else {
                const sign = a.x < b.x ? -1 : 1;
                if (!aHeld) {
                  a.x += sign * overlapX * push;
                  a.vx *= -0.3;
                }
                if (!bHeld) {
                  b.x -= sign * overlapX * push;
                  b.vx *= -0.3;
                }
              }
            }
          }
      }
      paint();
      frame = requestAnimationFrame(update);
    };
    initialize();
    const resize = new ResizeObserver(initialize);
    resize.observe(root.current);
    if (isInView && !reduced) frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
    };
  }, [isInView, reduced, resetKey]);

  return (
    <div className="industry-playground-wrap">
      <div className="industry-options" aria-label="Explore industry solutions">
        {industryLabels.map((label, index) => (
          <button
            key={label}
            aria-label={`Show ${label.replace(" ↗", "")} solutions`}
            aria-pressed={selected === index}
            aria-controls="industry-solution"
            onClick={() => setSelected(index)}
          >
            <span>0{index + 1}</span>
            {label}
          </button>
        ))}
      </div>
      <div
        className="industry-solution"
        id="industry-solution"
        role="region"
        aria-label={`${industryLabels[selected].replace(" ↗", "")} solutions`}
      >
        <div className="industry-solution-art" aria-hidden="true">
          <svg className="industry-bg-orbit" viewBox="0 0 320 230" fill="none">
            <path
              className="industry-orbit"
              d="M160 35C295 35 295 195 160 195S25 35 160 35Z"
            />
            <path
              className="industry-orbit second"
              d="M45 115C45-5 275-5 275 115S45 235 45 115Z"
            />
          </svg>
          <IndustryArt selected={selected} />
          <span className="industry-coordinate">
            0{selected + 1} / CONNECTED POSSIBILITIES
          </span>
          <b>{String(selected + 1).padStart(2, "0")}</b>
        </div>
        <div className="industry-solution-copy" key={selected}>
          <span className="section-kicker">
            {industryLabels[selected].replace(" ↗", "")}
          </span>
          <h3>{industrySolutions[selected].title}</h3>
          <p>{industrySolutions[selected].description}</p>
          <div className="service-tags">
            {industrySolutions[selected].tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p className="industry-example">
            <span>A POSSIBILITY IN PRACTICE</span>
            {industrySolutions[selected].example}
          </p>
          <ContactButton className="text-link">
            Let’s talk about your world <ArrowUpRight size={17} />
          </ContactButton>
        </div>
      </div>
      <div className="industry-wall-top">
        <span>DIFFERENT WORLDS. SHARED AMBITION.</span>
        <button
          className="text-link"
          onClick={() => setResetKey(resetKey + 1)}
          aria-label="Reset industry stickers"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>
      <div
        className="industry-playground"
        ref={root}
        aria-label="Interactive industries. Drag a label, or use arrow keys to move it."
      >
        <span className="industry-wall-watermark" aria-hidden="true">
          Possibilities.
        </span>
        {industryLabels.map((label, index) => (
          <button
            key={label}
            ref={(el) => {
              labels.current[index] = el;
            }}
            className={`industry-sticker sticker-${index}`}
            aria-label={`Explore ${label.replace(" ↗", "")}`}
            onPointerDown={(event) => {
              if (!bodies.current[index] || !root.current) return;
              const bounds = root.current.getBoundingClientRect(),
                body = bodies.current[index];
              dragging.current = {
                index,
                offsetX: event.clientX - bounds.left - body.x,
                offsetY: event.clientY - bounds.top - body.y,
                moved: false,
                lastX: event.clientX,
                lastY: event.clientY,
                lastTime: performance.now(),
              };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              const drag = dragging.current;
              if (!drag || drag.index !== index || !root.current) return;
              const bounds = root.current.getBoundingClientRect(),
                body = bodies.current[index];
              const now = performance.now(),
                elapsed = Math.max(now - drag.lastTime, 8);
              if (
                Math.abs(event.clientX - drag.lastX) +
                  Math.abs(event.clientY - drag.lastY) >
                3
              )
                drag.moved = true;
              body.x = Math.max(
                10,
                Math.min(
                  bounds.width - body.width - 10,
                  event.clientX - bounds.left - drag.offsetX,
                ),
              );
              body.y = Math.max(
                10,
                Math.min(
                  bounds.height - body.height - 10,
                  event.clientY - bounds.top - drag.offsetY,
                ),
              );
              body.vx = Math.max(
                -12,
                Math.min(12, ((event.clientX - drag.lastX) / elapsed) * 12),
              );
              body.vy = Math.max(
                -12,
                Math.min(12, ((event.clientY - drag.lastY) / elapsed) * 12),
              );
              event.currentTarget.style.transform = `translate3d(${body.x}px,${body.y}px,0) rotate(${body.rotation}deg)`;
              drag.lastX = event.clientX;
              drag.lastY = event.clientY;
              drag.lastTime = now;
            }}
            onPointerUp={(event) => {
              const moved = dragging.current?.moved;
              dragging.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);
              if (moved) event.currentTarget.dataset.dragged = "true";
            }}
            onPointerCancel={() => {
              dragging.current = null;
            }}
            onClick={(event) => {
              if (event.currentTarget.dataset.dragged === "true") {
                event.currentTarget.dataset.dragged = "false";
                return;
              }
              setSelected(index);
              const solution = document.getElementById("industry-solution");
              if (solution)
                scrollPageTo(solution, {
                  immediate: Boolean(reduced) || event.detail === 0,
                });
            }}
            onKeyDown={(event) => {
              const body = bodies.current[index];
              if (!body || !root.current) return;
              const moves: Record<string, [number, number]> = {
                ArrowLeft: [-20, 0],
                ArrowRight: [20, 0],
                ArrowUp: [0, -20],
                ArrowDown: [0, 20],
              };
              if (moves[event.key]) {
                event.preventDefault();
                body.x = Math.max(
                  10,
                  Math.min(
                    root.current.clientWidth - body.width - 10,
                    body.x + moves[event.key][0],
                  ),
                );
                body.y = Math.max(
                  10,
                  Math.min(
                    root.current.clientHeight - body.height - 10,
                    body.y + moves[event.key][1],
                  ),
                );
                body.vx = 0;
                body.vy = 0;
                event.currentTarget.style.transform = `translate3d(${body.x}px,${body.y}px,0) rotate(${body.rotation}deg)`;
              }
            }}
          >
            {index === 7 ? (
              <Sparkles size={20} />
            ) : (
              <span className="sticker-dot" />
            )}
            {label}
          </button>
        ))}
      </div>
      <p className="industry-wall-note">
        A little curiosity goes a long way. Drag, throw, or tap to explore.
      </p>
    </div>
  );
}

export function ShaderFooter() {
  return (
    <OptionalFeatureBoundary feature="footer-animation">
      <FooterArtwork />
    </OptionalFeatureBoundary>
  );
}

function FooterArtwork() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(canvas, { margin: "150px" });
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = canvas.current;
    if (!el || !inView) return;
    const gl = el.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const vertex = compile(
      gl.VERTEX_SHADER,
      "attribute vec2 position; void main(){gl_Position=vec4(position,0.0,1.0);}",
    );
    const fragment = compile(
      gl.FRAGMENT_SHADER,
      `precision mediump float; uniform vec2 resolution; uniform float time; uniform vec2 pointer; void main(){vec2 uv=gl_FragCoord.xy/resolution;vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.);float wave=sin(p.x*3.5+time*.25+sin(p.y*4.-time*.18))*0.11;float ribbon=exp(-pow((p.y-wave+0.08*sin(p.x*2.+time*.15))*5.5,2.));float edge=exp(-pow((p.y-wave-.08)*13.,2.));float glow=exp(-length(p-pointer)*2.);vec3 color=mix(vec3(.025,.035,.075),vec3(.025,.15,.68),ribbon*.85);color+=vec3(.07,.22,.6)*edge*.5;color+=vec3(.01,.035,.12)*glow;gl_FragColor=vec4(color,1.);}`,
    );
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "resolution"),
      time = gl.getUniformLocation(program, "time"),
      pointer = gl.getUniformLocation(program, "pointer");
    let frame = 0;
    let mouseX = 0.4;
    let mouseY = 0.3;
    const move = (event: PointerEvent) => {
      const bounds = el.getBoundingClientRect();
      mouseX = (event.clientX - bounds.left) / bounds.width - 0.5;
      mouseY = 0.5 - (event.clientY - bounds.top) / bounds.height;
    };
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      el.width = el.clientWidth * ratio;
      el.height = el.clientHeight * ratio;
      gl.viewport(0, 0, el.width, el.height);
    };
    const render = (now: number) => {
      gl.uniform2f(resolution, el.width, el.height);
      gl.uniform1f(time, reduced || paused ? 0 : now / 1000);
      gl.uniform2f(pointer, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced && !paused) frame = requestAnimationFrame(render);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    render(0);
    el.parentElement?.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.parentElement?.removeEventListener("pointermove", move);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [inView, reduced, paused]);
  return (
    <>
      <canvas ref={canvas} className="footer-shader" aria-hidden="true" />
      <button
        className="footer-motion-toggle"
        onClick={() => setPaused(!paused)}
        aria-label={paused ? "Play footer animation" : "Pause footer animation"}
      >
        {paused ? "Play motion ▷" : "Pause motion Ⅱ"}
      </button>
    </>
  );
}
