export const scenarios = [
  {
    id: "payments",
    name: "Payments, without the guesswork.",
    industry: "FinTech",
    summary:
      "An illustrative approach to handling retries, webhooks and payment state when an external provider is unavailable.",
    challenge:
      "A payment request times out. The application needs to find out whether the provider accepted it before deciding to retry.",
    approach:
      "Use provider-supported idempotency keys, persist state transitions and reconcile webhook events. Queue retries with backoff and surface unresolved states for review.",
    verify:
      "Test repeated requests, timeout recovery, webhook ordering and reconciliation against the selected provider's documented behavior.",
    stack: ["Provider APIs", "PostgreSQL", "Task queue"],
    service: "web-applications",
  },
  {
    id: "retrieval",
    name: "Useful answers, with a source.",
    industry: "AI & Knowledge",
    summary:
      "An illustrative document assistant that connects search results to a grounded response and gives users a path to check the evidence.",
    challenge:
      "A team needs to find information across documents while respecting document permissions and handling incomplete evidence.",
    approach:
      "Retrieve authorized passages, combine keyword and vector retrieval where useful, cite source documents and ask for human review when evidence is insufficient.",
    verify:
      "Evaluate groundedness, authorization boundaries, retrieval relevance, response time and cost using representative documents and questions.",
    stack: ["Document storage", "pgvector", "Model API"],
    service: "ai-automation",
  },
  {
    id: "operations",
    name: "A clearer view of operations.",
    industry: "Logistics",
    summary:
      "An illustrative event-driven dashboard for following status changes across devices, jobs and connected services.",
    challenge:
      "Updates arrive late or out of order. Operators need an honest picture of current state and a way to investigate missing events.",
    approach:
      "Store event timestamps and identifiers, distinguish stale data from fresh updates and use reconnect and replay strategies for interrupted streams.",
    verify:
      "Exercise reconnections, out-of-order events and representative load. Agree freshness targets based on the actual operational workflow.",
    stack: ["WebSockets", "Event storage", "Observability"],
    service: "web-applications",
  },
  {
    id: "commerce",
    name: "From discovery to checkout.",
    industry: "Commerce",
    summary:
      "An illustrative storefront architecture that connects a responsive buying journey to accurate inventory and order state.",
    challenge:
      "Product information changes across systems, while customers need a clear and reliable route from search to purchase.",
    approach:
      "Plan cache invalidation, inventory reconciliation and responsive purchase flows. Test the full order journey, including failures and recovery.",
    verify:
      "Measure real-user interaction performance, layout stability, conversion journeys and stock consistency before making performance claims.",
    stack: ["Next.js", "Commerce APIs", "PostgreSQL"],
    service: "web-development",
  },
];
