export const site = {
  name: "VENIZOR",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://venizor.com",
  email: "info@venizor.com",
  bookingUrl: process.env.NEXT_PUBLIC_CAL_LINK || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  legalName: process.env.NEXT_PUBLIC_BUSINESS_NAME || "",
  city: process.env.NEXT_PUBLIC_BUSINESS_CITY || "",
};

export const isIndexable =
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.SITE_INDEXABLE === "true");

export const routeInfo: Record<
  string,
  { title: string; description: string; label: string }
> = {
  "/": {
    title: "Software, Web & AI Development Studio in India",
    description:
      "Build your next web application, mobile product or AI workflow with VENIZOR. An independent technology studio connecting strategy, design and engineering.",
    label: "Home",
  },
  "/about": {
    title: "About Our Independent Design & Engineering Studio",
    description:
      "Meet VENIZOR's approach to product strategy, considered design and practical engineering. Explore how we collaborate, plan delivery and build useful software.",
    label: "About",
  },
  "/blog": {
    title: "Field Notes on Software, AI & Product Engineering",
    description:
      "Explore VENIZOR field notes on API integrations, applied AI, databases, cloud delivery and digital growth, with code examples and architecture explanations.",
    label: "Field notes",
  },
  "/case-studies": {
    title: "Illustrative Architecture Scenarios & Design Patterns",
    description:
      "Explore illustrative payment, retrieval, logistics and commerce architectures. These educational scenarios demonstrate design approaches, not client results.",
    label: "Architecture scenarios",
  },
  "/contact": {
    title: "Discuss Your Web, Software or AI Project With Us",
    description:
      "Tell VENIZOR what you want to build or improve. Share your project goals, explore an engagement and discuss the next step with our technology studio in India.",
    label: "Contact",
  },
  "/services": {
    title: "Web, Mobile, SaaS, AI & Digital Growth Services",
    description:
      "Explore eight VENIZOR services covering web development, mobile apps, SaaS products, AI automation, digital marketing, SEO and answer engine optimization.",
    label: "Services",
  },
  "/playbook": {
    title: "Interactive Technology Stack Planning Playbook",
    description:
      "Explore technology choices for your next software product with VENIZOR's interactive stack playbook. Compare architecture options before planning a build.",
    label: "Stack playbook",
  },
  "/simulator": {
    title: "API & AI Workflow Simulator — Interactive Examples",
    description:
      "Explore simulated API retries and AI retrieval workflows. Change the inputs and inspect illustrative outcomes before discussing your own system architecture.",
    label: "Pipeline simulator",
  },
  "/scope": {
    title: "Project Scope Wizard for Software & AI Products",
    description:
      "Outline your next software project with VENIZOR's scope wizard. Choose capabilities, review an indicative delivery outline and share your brief for discussion.",
    label: "Scope wizard",
  },
  "/tools": {
    title: "Developer Tools for Everyday Engineering Tasks",
    description:
      "Use VENIZOR's browser-based developer utilities for common engineering tasks. Explore useful tools alongside our software, API and product development services.",
    label: "Developer tools",
  },
  "/careers": {
    title: "Careers & Expressions of Interest at Our Studio",
    description:
      "Explore how VENIZOR approaches engineering and design collaboration. Contact the studio about future opportunities and share your experience and interests.",
    label: "Careers",
  },
  "/privacy": {
    title: "Privacy Notice — Website Data & Project Enquiries",
    description:
      "Understand how VENIZOR handles website enquiries, optional analytics, local preferences and project information, and how to contact us about your data.",
    label: "Privacy",
  },
  "/terms": {
    title: "Website Terms — Content, Tools & Project Enquiries",
    description:
      "Read VENIZOR's website terms covering illustrative concepts, educational tools, intellectual property and the separate agreements that govern client projects.",
    label: "Terms",
  },
};
