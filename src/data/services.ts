export interface StudioService {
  slug: string;
  name: string;
  audience: string;
  intro: string;
  deliverables: string[];
  technologies: string[];
  questions: { q: string; a: string }[];
  example: string;
}

export const services: StudioService[] = [
  {
    slug: "web-development",
    name: "Website development",
    audience: "for businesses with something to say",
    intro:
      "Website development brings your brand, content and customer journeys together in a responsive site. We work with founders and business teams who need a clear way to explain their offer, publish useful information and turn interest into enquiries, with a maintainable foundation for future updates.",
    deliverables: [
      "Content structure and page planning",
      "Responsive design and implementation",
      "Search metadata and structured data",
      "Form integration, testing and launch handover",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Vercel"],
    example:
      "A service business website with clear offers, helpful resources and a project enquiry flow.",
    questions: [
      {
        q: "Can you improve an existing website?",
        a: "Yes. We can review the content, user journeys, accessibility and implementation before agreeing which parts to retain or rebuild.",
      },
      {
        q: "Will the site work on mobile?",
        a: "Responsive layouts are part of the scope. We agree target devices and test important journeys at small and large viewport sizes.",
      },
      {
        q: "Can our team edit the content?",
        a: "We can include a content management system if your publishing needs justify it. Editing workflows are agreed during discovery.",
      },
      {
        q: "How much will it cost and how long will it take?",
        a: "Page count, content readiness, integrations and review cycles determine the estimate. We provide a scoped timeline and price after reviewing your brief.",
      },
    ],
  },
  {
    slug: "web-applications",
    name: "Web application development",
    audience: "for startups and growing teams",
    intro:
      "A custom web application turns a business workflow into software people can use in their browser. We help startups and established teams plan and build dashboards, portals and operational tools around their users, data and integrations, starting with the smallest useful release and a clear path to improve it.",
    deliverables: [
      "Workflow discovery and interactive prototype",
      "Application interfaces and API contracts",
      "Authentication and data model",
      "Integration testing and operational handover",
    ],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    example:
      "A customer portal connecting project information, approvals and billing in one workflow.",
    questions: [
      {
        q: "Can you connect our existing systems?",
        a: "We review the available APIs, access controls and data ownership before proposing an integration approach.",
      },
      {
        q: "Can you start with an MVP?",
        a: "Yes. We identify the core user journey and plan a focused release with explicit acceptance criteria.",
      },
      {
        q: "Who owns the application?",
        a: "Code ownership, repositories and third-party licenses are documented in the project agreement.",
      },
      {
        q: "How do you plan for growth?",
        a: "We agree expected usage, measure representative workloads and choose a design that can evolve. Performance commitments require project-specific testing.",
      },
    ],
  },
  {
    slug: "mobile-app-development",
    name: "Mobile app development",
    audience: "for useful everyday experiences",
    intro:
      "Mobile app development creates an experience designed for the way people use their phones. We help businesses plan iOS and Android products, connect them to existing services and prepare for release. The choice between native and shared code follows your device requirements, team needs and long-term maintenance plans.",
    deliverables: [
      "Mobile journeys and interaction design",
      "Application and backend integration",
      "Device and accessibility testing",
      "Store submission preparation and handover",
    ],
    technologies: ["React Native", "TypeScript", "iOS", "Android"],
    example:
      "A field-service app for reviewing assignments and recording updates while away from a desk.",
    questions: [
      {
        q: "Do we need separate iOS and Android apps?",
        a: "Sometimes. We compare shared-code and native approaches against your device features, performance requirements and maintenance budget.",
      },
      {
        q: "Can the app work offline?",
        a: "Offline use needs explicit sync rules and conflict handling. We scope those workflows early if your users need them.",
      },
      {
        q: "Do you help with app store submission?",
        a: "Submission preparation can be included. Store approval and review timing remain subject to the platform's policies.",
      },
      {
        q: "Can you work with an existing backend?",
        a: "Yes, subject to a review of the APIs, authentication and environments available for development and testing.",
      },
    ],
  },
  {
    slug: "ai-automation",
    name: "AI & workflow automation",
    audience: "for teams with work to simplify",
    intro:
      "AI integration and automation connect useful model capabilities to a defined business workflow. We help teams evaluate document retrieval, assistants and repetitive tasks, with human review where judgment matters. A suitable project starts with real examples, a measurable quality baseline and clear limits on what the system can do.",
    deliverables: [
      "Workflow and data suitability assessment",
      "Prototype with representative evaluation cases",
      "Model and tool integration with review controls",
      "Cost monitoring, failure handling and handover",
    ],
    technologies: ["Model APIs", "PostgreSQL", "pgvector", "TypeScript"],
    example:
      "A document assistant that cites retrieved passages and routes uncertain answers to a person.",
    questions: [
      {
        q: "Does every automation need AI?",
        a: "No. Rules and conventional integrations are often more predictable for well-defined tasks. We choose AI when its capabilities justify the added uncertainty and cost.",
      },
      {
        q: "Can we use our private documents?",
        a: "We review permissions, data sensitivity, provider terms and retention requirements before choosing a storage and retrieval approach.",
      },
      {
        q: "How do you evaluate answer quality?",
        a: "We use representative examples and agreed criteria such as groundedness, task success and review effort. Results depend on your data and workflow.",
      },
      {
        q: "Can a person approve actions?",
        a: "Yes. Approval steps, permission boundaries and audit records can be designed into the workflow before any consequential action is allowed.",
      },
    ],
  },
  {
    slug: "saas-product-development",
    name: "SaaS product development",
    audience: "for founders building the next useful product",
    intro:
      "SaaS product development combines product discovery, interface design and software engineering to create a hosted application. We work with founders and product teams to define a useful first release, plan tenant and account boundaries, and connect the billing, administration and operational tools needed to support a subscription business.",
    deliverables: [
      "Product scope and release roadmap",
      "Account, role and tenant architecture",
      "Billing and administration workflows",
      "Release testing and operating documentation",
    ],
    technologies: ["Next.js", "PostgreSQL", "Billing APIs", "Cloud hosting"],
    example:
      "A subscription workspace for managing approvals across multiple customer organizations.",
    questions: [
      {
        q: "Can you help validate the product idea?",
        a: "We can plan interviews, prototypes and a focused release. Market demand needs evidence from your intended customers.",
      },
      {
        q: "How do you handle multiple tenants?",
        a: "We choose isolation and authorization boundaries based on the product's data, risk and operating requirements, then test access between accounts.",
      },
      {
        q: "Can you integrate subscription billing?",
        a: "Yes. We scope plan changes, webhooks, access rules and payment-provider behavior together.",
      },
      {
        q: "What happens after launch?",
        a: "Support, incident response, ongoing development and ownership are agreed separately so expectations are clear before release.",
      },
    ],
  },
  {
    slug: "digital-marketing",
    name: "Digital marketing",
    audience: "for businesses ready to learn what works",
    intro:
      "Digital marketing connects your audience, message and distribution channels to a measurable business goal. We help teams plan content and campaigns, improve landing journeys and understand which activities lead to useful conversations. The work starts with your positioning and measurement baseline rather than promises of traffic or revenue.",
    deliverables: [
      "Audience and messaging review",
      "Channel and content plan",
      "Landing page and conversion improvements",
      "Measurement setup and reporting framework",
    ],
    technologies: [
      "Analytics",
      "Search Console",
      "Campaign platforms",
      "Content systems",
    ],
    example:
      "A campaign landing journey that connects a specific offer to an attributable enquiry.",
    questions: [
      {
        q: "Which channels should we use?",
        a: "That depends on your audience, offer and resources. We prioritize a small number of testable channels based on those inputs.",
      },
      {
        q: "Do you guarantee leads?",
        a: "No. Outcomes depend on the offer, market and execution. We agree measurable experiments and report the results honestly.",
      },
      {
        q: "Can we use our existing analytics?",
        a: "Yes. We first check consent, event definitions and data quality before adding more tools.",
      },
      {
        q: "How do you report progress?",
        a: "We connect channel activity to agreed outcomes such as qualified enquiries, bookings or activation, rather than relying only on traffic totals.",
      },
    ],
  },
  {
    slug: "seo",
    name: "Technical SEO",
    audience: "for sites that deserve to be found",
    intro:
      "Technical SEO helps search engines discover and understand your website while improving the experience for visitors. We review crawling, indexing, page structure, metadata and performance, then connect technical fixes to a helpful content plan. The service suits businesses that need a maintainable search foundation and clear measurement of progress.",
    deliverables: [
      "Crawl and indexing audit",
      "Metadata, canonical and sitemap fixes",
      "Content structure and internal linking plan",
      "Search performance baseline and follow-up",
    ],
    technologies: [
      "Search Console",
      "Bing Webmaster Tools",
      "Structured data",
      "Performance tooling",
    ],
    example:
      "A service site with clear dedicated pages, accurate canonical URLs and useful internal links.",
    questions: [
      {
        q: "Can you guarantee first-page rankings?",
        a: "No. Search rankings are controlled by search engines and depend on many factors beyond technical implementation.",
      },
      {
        q: "Does a redesign affect SEO?",
        a: "It can. We plan URL continuity, redirects, metadata and indexing checks as part of a migration.",
      },
      {
        q: "How soon can we measure progress?",
        a: "Technical fixes can be checked immediately. Crawling, indexing and organic visibility change over time, so we establish a baseline and review trends.",
      },
      {
        q: "Do you write content too?",
        a: "Content planning and editing can be included. Claims and expertise must be supported by your real business knowledge and evidence.",
      },
    ],
  },
  {
    slug: "answer-engine-optimization",
    name: "Answer engine optimization",
    audience: "for clear, credible business information",
    intro:
      "Answer engine optimization makes your business information easier for people and automated systems to understand. We help teams structure accurate service descriptions, useful answers and consistent entity details, supported by appropriate schema. This complements search fundamentals and original expertise; it cannot guarantee a citation, recommendation or placement in an AI answer.",
    deliverables: [
      "Entity and content accuracy review",
      "Question-led service content",
      "Appropriate schema and crawler checks",
      "Repeatable citation baseline and monitoring plan",
    ],
    technologies: [
      "Schema.org",
      "Server-rendered content",
      "Crawler logs",
      "Citation tracking",
    ],
    example:
      "A service page with a concise explanation, original evidence, buyer questions and consistent business details.",
    questions: [
      {
        q: "Is this different from SEO?",
        a: "The foundations overlap. Clear service content, crawlable pages and credible evidence help both people and machines understand a business.",
      },
      {
        q: "Can you guarantee AI citations?",
        a: "No. Each engine chooses its sources independently. We improve clarity and access, then measure actual mentions and referrals.",
      },
      {
        q: "Do we need llms.txt?",
        a: "It is a low-cost supplementary file. It does not replace useful pages, verified business information or a sound technical foundation.",
      },
      {
        q: "How do you measure visibility?",
        a: "We record a consistent set of buyer questions, engine responses, cited sources and referral traffic over time.",
      },
    ],
  },
];
