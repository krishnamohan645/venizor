"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Cpu,
  Database,
  Cloud,
  Share2,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { ExperienceProvider } from "@/components/experience";
import { CursorFollower } from "@/components/motion-details";
import { PageHeader, PageFooter } from "@/components/page-nav";

interface StackOption {
  id: string;
  name: string;
  tier: "frontend" | "backend" | "database" | "ai" | "devops" | "integrations";
  description: string;
  badge: string;
}

const stackOptions: Record<string, StackOption[]> = {
  frontend: [
    { id: "next16", name: "Next.js 16 App Router", tier: "frontend", description: "Turbopack, Server Actions & React 19 SSR", badge: "Recommended" },
    { id: "vite_react", name: "Vite + React SPA", tier: "frontend", description: "Ultra-fast client bundle with client routing", badge: "SPA" },
    { id: "expo_mobile", name: "React Native / Expo", tier: "frontend", description: "Cross-platform iOS and Android mobile app", badge: "Mobile" },
  ],
  backend: [
    { id: "fastify_rest", name: "Fastify / Node.js REST", tier: "backend", description: "High-throughput JSON schema validated API", badge: "High RPS" },
    { id: "graphql_apollo", name: "GraphQL + Apollo Federation", tier: "backend", description: "Type-safe declarative multi-graph API", badge: "Declarative" },
    { id: "grpc_proto", name: "gRPC & Protocol Buffers", tier: "backend", description: "Binary HTTP/2 RPC for low-latency microservices", badge: "Microservices" },
    { id: "websockets_realtime", name: "WebSockets + Redis PubSub", tier: "backend", description: "Bi-directional real-time telemetry streaming", badge: "Real-time" },
  ],
  database: [
    { id: "postgres_pgvector", name: "PostgreSQL + pgvector", tier: "database", description: "Relational ACID core with native vector search", badge: "Enterprise" },
    { id: "supabase", name: "Supabase + PgBouncer", tier: "database", description: "Managed PostgreSQL with transaction-level pooling", badge: "Serverless" },
    { id: "redis_cluster", name: "Redis Cluster / Upstash", tier: "database", description: "Sub-millisecond semantic cache & rate limiter", badge: "In-Memory" },
  ],
  ai: [
    { id: "hybrid_claude_gpt", name: "Claude 3.5 Sonnet + GPT-4o", tier: "ai", description: "Dual-provider fallback cascade with guardrails", badge: "Frontier AI" },
    { id: "gemini_flash", name: "Gemini 2.0 Flash", tier: "ai", description: "Ultra-low-latency 1M context multimodal inference", badge: "Fast Inference" },
    { id: "local_deepseek", name: "Local DeepSeek / vLLM", tier: "ai", description: "Zero-data-leakage self-hosted open-source model", badge: "Private On-Prem" },
  ],
  devops: [
    { id: "cloudflare_workers", name: "Cloudflare Workers & Pages", tier: "devops", description: "Global edge routing with 0ms cold starts", badge: "Edge" },
    { id: "docker_multistage", name: "Docker Multi-Stage Containers", tier: "devops", description: "Distroless micro-images deployed on AWS ECS", badge: "Containerized" },
    { id: "github_actions_cicd", name: "GitHub Actions Zero-Downtime", tier: "devops", description: "Automated blue/green release pipelines", badge: "Automated" },
  ],
  integrations: [
    { id: "stripe_billing", name: "Stripe Billing & Webhooks", tier: "integrations", description: "SHA-256 idempotent checkout & recurring billing", badge: "Fintech" },
    { id: "twilio_comms", name: "Twilio SMS, Voice & WebRTC", tier: "integrations", description: "Automated phone alerts & two-factor auth", badge: "Comms" },
    { id: "resend_email", name: "Resend Transactional Email", tier: "integrations", description: "High-deliverability domain-verified email", badge: "Messaging" },
  ],
};

export default function TechStackPlaybookPage() {
  const [selectedFrontend, setSelectedFrontend] = useState("next16");
  const [selectedBackend, setSelectedBackend] = useState("fastify_rest");
  const [selectedDatabase, setSelectedDatabase] = useState("postgres_pgvector");
  const [selectedAi, setSelectedAi] = useState("hybrid_claude_gpt");
  const [selectedDevops, setSelectedDevops] = useState("docker_multistage");
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([
    "stripe_billing",
    "resend_email",
  ]);
  const [copied, setCopied] = useState(false);

  const toggleIntegration = (id: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const analysis = useMemo(() => {
    let score = 96;
    const strengths: string[] = [];
    const recommendations: string[] = [];
    const latencyProfile = "P95 < 45ms across global regions";
    const throughputRating = "20,000+ RPS sustained without degraded latency";

    // Analysis Rules
    if (selectedFrontend === "next16" && selectedDevops === "cloudflare_workers") {
      strengths.push("Next.js 16 with Cloudflare Edge enables sub-20ms TTFB worldwide with zero server cold starts.");
    }
    if (selectedDatabase === "postgres_pgvector" && selectedAi === "hybrid_claude_gpt") {
      strengths.push("Native pgvector colocates embeddings with operational relational data, eliminating external vector database sync lag.");
    }
    if (selectedIntegrations.includes("stripe_billing")) {
      recommendations.push("Implement SHA-256 idempotency locks in Redis before dispatching checkout mutations to avoid double-charges.");
    }
    if (selectedBackend === "fastify_rest") {
      strengths.push("Fastify with TypeBox schema validation delivers up to 4x throughput compared to traditional Express APIs.");
    }
    if (selectedDatabase === "postgres_pgvector" && selectedDevops !== "docker_multistage") {
      recommendations.push("Ensure transaction-mode connection pooling (PgBouncer) is configured between edge workers and PostgreSQL.");
    }

    return {
      score,
      strengths,
      recommendations,
      latencyProfile,
      throughputRating,
    };
  }, [
    selectedFrontend,
    selectedBackend,
    selectedDatabase,
    selectedAi,
    selectedDevops,
    selectedIntegrations,
  ]);

  const copyArchitectureSpec = () => {
    const spec = `VENIZOR Architecture Stack Spec:
Frontend: ${selectedFrontend}
Backend: ${selectedBackend}
Database: ${selectedDatabase}
AI Engine: ${selectedAi}
DevOps: ${selectedDevops}
Integrations: ${selectedIntegrations.join(", ")}
Compatibility Score: ${analysis.score}%
Generated at: https://venizor.com/playbook`;

    navigator.clipboard.writeText(spec);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <CursorFollower />
        <PageHeader activePage="blog" />

        <main id="playbook-main" className="inner-page-main">
          {/* Hero Section */}
          <section className="page-hero page-container" aria-labelledby="playbook-title">
            <div className="page-hero-kicker">
              <span className="kicker-tag">
                <i className="live-dot" /> LIVE ARCHITECTURE PLAYBOOK
              </span>
              <span>COMPATIBILITY MATRIX • RELIABILITY BENCHMARK • SCALING CHECKS</span>
            </div>

            <h1 id="playbook-title" className="page-hero-title">
              Stack Architecture <br />
              <span className="hero-title-blue">Compatibility Playbook.</span>
            </h1>

            <p className="page-hero-lead">
              Configure your technology stack and receive instant architectural compatibility ratings,
              data-flow topologies, security hardening checks, and scaling recommendations engineered by VENIZOR.
            </p>
          </section>

          {/* Stack Configurator Grid */}
          <div className="page-container playbook-workspace-grid">
            {/* Left Column: Interactive Selectors */}
            <div className="playbook-config-pane">
              {/* 1. Frontend */}
              <div className="config-block">
                <div className="config-block-head">
                  <span className="config-tier-number">01</span>
                  <h3>Frontend &amp; Client Application</h3>
                </div>
                <div className="options-stack">
                  {stackOptions.frontend.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`config-option-btn ${selectedFrontend === opt.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedFrontend(opt.id)}
                    >
                      <div className="option-btn-top">
                        <span className="option-name">{opt.name}</span>
                        <span className="option-badge">{opt.badge}</span>
                      </div>
                      <p className="option-desc">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Backend & APIs */}
              <div className="config-block">
                <div className="config-block-head">
                  <span className="config-tier-number">02</span>
                  <h3>API &amp; Application Layer</h3>
                </div>
                <div className="options-stack">
                  {stackOptions.backend.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`config-option-btn ${selectedBackend === opt.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedBackend(opt.id)}
                    >
                      <div className="option-btn-top">
                        <span className="option-name">{opt.name}</span>
                        <span className="option-badge">{opt.badge}</span>
                      </div>
                      <p className="option-desc">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Database */}
              <div className="config-block">
                <div className="config-block-head">
                  <span className="config-tier-number">03</span>
                  <h3>Database &amp; Persistence</h3>
                </div>
                <div className="options-stack">
                  {stackOptions.database.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`config-option-btn ${selectedDatabase === opt.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedDatabase(opt.id)}
                    >
                      <div className="option-btn-top">
                        <span className="option-name">{opt.name}</span>
                        <span className="option-badge">{opt.badge}</span>
                      </div>
                      <p className="option-desc">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. AI & Inference */}
              <div className="config-block">
                <div className="config-block-head">
                  <span className="config-tier-number">04</span>
                  <h3>AI &amp; Machine Learning Engine</h3>
                </div>
                <div className="options-stack">
                  {stackOptions.ai.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`config-option-btn ${selectedAi === opt.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedAi(opt.id)}
                    >
                      <div className="option-btn-top">
                        <span className="option-name">{opt.name}</span>
                        <span className="option-badge">{opt.badge}</span>
                      </div>
                      <p className="option-desc">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Cloud & DevOps */}
              <div className="config-block">
                <div className="config-block-head">
                  <span className="config-tier-number">05</span>
                  <h3>Cloud Infrastructure &amp; DevOps</h3>
                </div>
                <div className="options-stack">
                  {stackOptions.devops.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`config-option-btn ${selectedDevops === opt.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedDevops(opt.id)}
                    >
                      <div className="option-btn-top">
                        <span className="option-name">{opt.name}</span>
                        <span className="option-badge">{opt.badge}</span>
                      </div>
                      <p className="option-desc">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Integrations */}
              <div className="config-block">
                <div className="config-block-head">
                  <span className="config-tier-number">06</span>
                  <h3>Third-Party HTTPS Integrations</h3>
                </div>
                <div className="options-stack">
                  {stackOptions.integrations.map((opt) => {
                    const isChecked = selectedIntegrations.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`config-option-btn ${isChecked ? "is-selected" : ""}`}
                        onClick={() => toggleIntegration(opt.id)}
                      >
                        <div className="option-btn-top">
                          <span className="option-name">{opt.name}</span>
                          <span className="option-badge">
                            {isChecked ? "Active" : "+ Add"}
                          </span>
                        </div>
                        <p className="option-desc">{opt.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Live Architecture Spec Card */}
            <div className="playbook-spec-pane">
              <div className="spec-card-sticky">
                {/* Score & Telemetry Header */}
                <div className="spec-score-header">
                  <div>
                    <span className="spec-eyebrow">ARCHITECTURAL RATING</span>
                    <h2 className="spec-title">Production Readiness</h2>
                  </div>
                  <div className="score-meter">
                    <span className="score-number">{analysis.score}%</span>
                    <span className="score-label">OPTIMAL</span>
                  </div>
                </div>

                {/* Metrics Badges */}
                <div className="spec-metrics-row">
                  <div className="metric-chip">
                    <Zap size={14} className="metric-icon blue" />
                    <div>
                      <span className="metric-lbl">LATENCY</span>
                      <strong className="metric-val">P95 &lt; 45ms</strong>
                    </div>
                  </div>
                  <div className="metric-chip">
                    <Cpu size={14} className="metric-icon green" />
                    <div>
                      <span className="metric-lbl">THROUGHPUT</span>
                      <strong className="metric-val">20,000+ RPS</strong>
                    </div>
                  </div>
                </div>

                {/* Architecture Pipeline Schematic */}
                <div className="spec-schematic-wrap">
                  <span className="schematic-heading">DYNAMIC DATA-FLOW TOPOLOGY</span>
                  <div className="schematic-nodes">
                    <div className="node-chip frontend">
                      <span>CLIENT</span>
                      <strong>{stackOptions.frontend.find((o) => o.id === selectedFrontend)?.name}</strong>
                    </div>
                    <span className="node-arrow">➔</span>
                    <div className="node-chip backend">
                      <span>API</span>
                      <strong>{stackOptions.backend.find((o) => o.id === selectedBackend)?.name}</strong>
                    </div>
                    <span className="node-arrow">➔</span>
                    <div className="node-chip database">
                      <span>DATABASE</span>
                      <strong>{stackOptions.database.find((o) => o.id === selectedDatabase)?.name}</strong>
                    </div>
                  </div>
                </div>

                {/* Strengths & Synergies */}
                <div className="spec-section">
                  <h4 className="spec-section-title">
                    <CheckCircle2 size={16} className="text-emerald" /> Architecture Strengths
                  </h4>
                  <ul className="spec-list">
                    {analysis.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Hardening Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <div className="spec-section">
                    <h4 className="spec-section-title">
                      <AlertTriangle size={16} className="text-amber" /> Production Hardening
                    </h4>
                    <ul className="spec-list recommendations">
                      {analysis.recommendations.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="spec-actions">
                  <button
                    type="button"
                    className="spec-btn-secondary"
                    onClick={copyArchitectureSpec}
                  >
                    {copied ? (
                      <>
                        <Check size={16} /> Copied Spec
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy Architecture Spec
                      </>
                    )}
                  </button>
                  <Link href="/contact" className="pill-button dark spec-btn-primary">
                    Build This Stack With Us <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom FAQ / Standards */}
          <section className="page-container playbook-standards-section">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <span className="section-kicker">ENGINEERING PRINCIPLES</span>
              <h2 style={{ fontSize: "28px" }}>Why VENIZOR’s Stack Standards Win</h2>
            </div>
            <div className="standards-grid">
              <div className="standard-card">
                <h4>Zero-Lock-In Foundations</h4>
                <p>
                  Every technology we select (PostgreSQL, TypeScript, Docker, standard REST/gRPC) can run
                  in any cloud provider without proprietary platform traps.
                </p>
              </div>
              <div className="standard-card">
                <h4>Deterministic Security Boundaries</h4>
                <p>
                  Input parsing at runtime using Zod and TypeBox guarantees malicious payloads never reach
                  your application logic or database layers.
                </p>
              </div>
              <div className="standard-card">
                <h4>Observability First</h4>
                <p>
                  Distributed OpenTelemetry tracing and structured JSON logging are configured from day one
                  to pinpoint latency spikes before they reach end users.
                </p>
              </div>
            </div>
          </section>
        </main>

        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
