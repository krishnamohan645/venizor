export const stackLayers = [
  {
    id: "frontend",
    label: "Experience",
    heading: "Start with the experience.",
    description:
      "Choose where people will use your product. This shapes navigation, delivery and the way your team builds.",
    hint: "Think about your audience’s devices, discoverability and offline needs.",
  },
  {
    id: "backend",
    label: "Application",
    heading: "Connect the moving parts.",
    description:
      "Choose how your application handles requests and communicates between services.",
    hint: "Start with the simplest interface that supports your actual workflows.",
  },
  {
    id: "database",
    label: "Data",
    heading: "Give your data a home.",
    description:
      "Choose a primary data layer for the information your product needs to keep and retrieve.",
    hint: "Data shape, retention and recovery requirements matter more than a benchmark.",
  },
  {
    id: "ai",
    label: "Intelligence",
    heading: "Make intelligence useful.",
    description:
      "Explore how AI could fit into the product, including the option to leave it out.",
    hint: "Define a useful task and an evaluation set before choosing a model.",
  },
  {
    id: "devops",
    label: "Delivery",
    heading: "Plan how it reaches people.",
    description:
      "Choose a delivery approach your team can deploy, observe and operate.",
    hint: "Backups, monitoring and rollback still need a plan.",
  },
  {
    id: "integrations",
    label: "Connections",
    heading: "Bring the right tools together.",
    description:
      "Add the external services your product needs. Select any combination, or leave this layer empty.",
    hint: "These choices describe your brief. They do not connect or activate any services.",
  },
] as const;
export type StackLayer = (typeof stackLayers)[number]["id"];
export type CoreLayer = Exclude<StackLayer, "integrations">;
export interface StackOption {
  id: string;
  name: string;
  description: string;
  tag: string;
}
export const stackOptions: Record<StackLayer, StackOption[]> = {
  frontend: [
    {
      id: "next16",
      name: "Next.js / React",
      description:
        "A web application with server rendering, content pages and interactive product flows.",
      tag: "Full-stack web",
    },
    {
      id: "vite_react",
      name: "Vite + React",
      description:
        "A client application for focused dashboards, workspaces and browser-based tools.",
      tag: "Client application",
    },
    {
      id: "expo_mobile",
      name: "React Native / Expo",
      description:
        "A shared application foundation for iOS and Android experiences.",
      tag: "Mobile",
    },
  ],
  backend: [
    {
      id: "fastify_rest",
      name: "Node.js / Fastify",
      description:
        "A REST interface with explicit routes and schema-based request validation.",
      tag: "REST API",
    },
    {
      id: "graphql_apollo",
      name: "GraphQL / Apollo",
      description:
        "A typed query interface for clients that need different views of shared data.",
      tag: "GraphQL",
    },
    {
      id: "grpc_proto",
      name: "gRPC / Protocol Buffers",
      description: "Contract-based communication between internal services.",
      tag: "Service communication",
    },
    {
      id: "websockets_realtime",
      name: "WebSockets / Redis PubSub",
      description:
        "Persistent connections for live updates, presence and collaborative workflows.",
      tag: "Real time",
    },
  ],
  database: [
    {
      id: "postgres_pgvector",
      name: "PostgreSQL / pgvector",
      description:
        "Relational data and vector search in a shared PostgreSQL foundation.",
      tag: "Relational + vector",
    },
    {
      id: "supabase",
      name: "Supabase / PostgreSQL",
      description:
        "Managed PostgreSQL with application services and connection-pooling options.",
      tag: "Managed data",
    },
    {
      id: "redis_cluster",
      name: "Redis / Upstash",
      description:
        "An in-memory data layer for caching, counters and short-lived application state.",
      tag: "Cache + state",
    },
  ],
  ai: [
    {
      id: "hybrid_claude_gpt",
      name: "Managed model APIs",
      description:
        "Provider-hosted models behind an application interface with evaluation and fallback rules.",
      tag: "Hosted inference",
    },
    {
      id: "local_deepseek",
      name: "Self-hosted / vLLM",
      description:
        "Model serving in your own environment, with capacity and operations owned by your team.",
      tag: "Self-hosted inference",
    },
    {
      id: "no_ai",
      name: "No AI layer",
      description:
        "Keep this product focused on conventional application logic. Revisit AI when a clear need emerges.",
      tag: "Keep it focused",
    },
  ],
  devops: [
    {
      id: "cloudflare_workers",
      name: "Cloudflare Workers",
      description:
        "An edge runtime for suitable web workloads, with runtime compatibility reviewed first.",
      tag: "Edge runtime",
    },
    {
      id: "docker_multistage",
      name: "Docker / cloud containers",
      description:
        "Container-based delivery with control over the runtime, deployment and scaling approach.",
      tag: "Containers",
    },
    {
      id: "github_actions_cicd",
      name: "GitHub Actions pipeline",
      description:
        "An automated build and release workflow. A separate hosting target is still required.",
      tag: "Delivery workflow",
    },
  ],
  integrations: [
    {
      id: "stripe_billing",
      name: "Stripe",
      description:
        "Checkout, subscriptions and payment events with server-side verification.",
      tag: "Payments",
    },
    {
      id: "twilio_comms",
      name: "Twilio",
      description:
        "Messaging and voice workflows with consent and delivery handling.",
      tag: "Communication",
    },
    {
      id: "resend_email",
      name: "Resend",
      description:
        "Transactional email with domain verification and delivery-event handling.",
      tag: "Email",
    },
  ],
};
export interface StackSelection {
  core: Record<CoreLayer, string>;
  integrations: string[];
}
export const presets: {
  id: string;
  name: string;
  description: string;
  selection: StackSelection;
}[] = [
  {
    id: "web",
    name: "Web product",
    description: "A useful place to begin.",
    selection: {
      core: {
        frontend: "next16",
        backend: "fastify_rest",
        database: "postgres_pgvector",
        ai: "no_ai",
        devops: "docker_multistage",
      },
      integrations: ["stripe_billing", "resend_email"],
    },
  },
  {
    id: "knowledge",
    name: "AI workspace",
    description: "Information into answers.",
    selection: {
      core: {
        frontend: "vite_react",
        backend: "fastify_rest",
        database: "postgres_pgvector",
        ai: "hybrid_claude_gpt",
        devops: "docker_multistage",
      },
      integrations: ["resend_email"],
    },
  },
  {
    id: "live",
    name: "Connected app",
    description: "Keep everyone in sync.",
    selection: {
      core: {
        frontend: "expo_mobile",
        backend: "websockets_realtime",
        database: "supabase",
        ai: "no_ai",
        devops: "docker_multistage",
      },
      integrations: ["twilio_comms"],
    },
  },
];
export function optionFor(layer: StackLayer, id: string) {
  return stackOptions[layer].find((option) => option.id === id)!;
}
export function reviewStack(selection: StackSelection) {
  const notes = [
    {
      title: "Define the boundaries",
      text: "Document authentication, authorization and validated inputs across the client, application and data layers.",
    },
  ];
  if (selection.core.database === "redis_cluster")
    notes.push({
      title: "Plan durable storage",
      text: "Review whether Redis is sufficient as the primary data layer. Durable records may need a separate database, with backups and recovery checks.",
    });
  else
    notes.push({
      title: "Design for recovery",
      text: "Plan database migrations, connection pooling, backup retention and a restore exercise before launch.",
    });
  if (selection.core.ai !== "no_ai")
    notes.push({
      title: "Evaluate the AI workflow",
      text: "Test representative questions, failure handling, data permissions and cost limits before relying on model output.",
    });
  if (selection.core.devops === "cloudflare_workers")
    notes.push({
      title: "Check runtime compatibility",
      text: "Validate framework support, database drivers and long-lived connection requirements against the chosen edge runtime.",
    });
  if (selection.core.devops === "github_actions_cicd")
    notes.push({
      title: "Choose a hosting target",
      text: "A CI/CD workflow builds and releases your application; choose and configure the environment that will run it.",
    });
  if (selection.core.backend === "websockets_realtime")
    notes.push({
      title: "Handle reconnects",
      text: "Plan authentication renewal, disconnected clients, message replay and shared state across application instances.",
    });
  if (selection.core.backend === "grpc_proto")
    notes.push({
      title: "Plan the client boundary",
      text: "Browser and mobile clients may need a gateway or compatible transport before they can communicate with internal gRPC services.",
    });
  if (selection.integrations.includes("stripe_billing"))
    notes.push({
      title: "Make payment events safe to retry",
      text: "Verify webhook signatures, deduplicate events and use idempotency keys for payment operations.",
    });
  if (!selection.integrations.length)
    notes.push({
      title: "Keep connections intentional",
      text: "No external services are included in this brief. Add them when the product has a specific need.",
    });
  return notes;
}
export function architectureBrief(selection: StackSelection) {
  return [
    "VENIZOR / Architecture exploration",
    "",
    ...stackLayers
      .filter((layer) => layer.id !== "integrations")
      .map(
        (layer) =>
          `${layer.label}: ${optionFor(layer.id, selection.core[layer.id as CoreLayer]).name}`,
      ),
    `Connections: ${selection.integrations.map((id) => optionFor("integrations", id).name).join(", ") || "None selected"}`,
    "",
    "Questions to validate",
    ...reviewStack(selection).map((note) => `- ${note.title}: ${note.text}`),
    "",
    "An exploratory brief, not a validated architecture or performance estimate.",
    "https://venizor.com/playbook",
  ].join("\n");
}
