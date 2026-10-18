"use client";

interface DiagramProps {
  slug: string;
}

export function BlogArchitectureDiagram({ slug }: DiagramProps) {
  switch (slug) {
    case "connecting-third-party-https-apis":
      return (
        <figure className="blog-diagram-card" aria-label="Webhook and API Idempotency Architecture">
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">Resilient HTTPS API &amp; Idempotency Pipeline</span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <rect width="920" height="280" rx="12" fill="#0c1017" />
            
            {/* Step 1: Inbound Request */}
            <g transform="translate(40, 50)">
              <rect width="140" height="90" rx="8" fill="#141c28" stroke="#1d2c3f" strokeWidth="1.5" />
              <text x="70" y="32" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">INBOUND CLIENT</text>
              <text x="70" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">Mutation API</text>
              <text x="70" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">e.g. Stripe Checkout</text>
            </g>

            {/* Arrow 1 */}
            <path d="M180 95 L220 95" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="220,95 212,90 212,100" fill="#3b82f6" />

            {/* Step 2: Idempotency Key Lock */}
            <g transform="translate(225, 50)">
              <rect width="150" height="90" rx="8" fill="#141c28" stroke="#2563eb" strokeWidth="1.5" />
              <text x="75" y="32" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="600">CRYPTO LAYER</text>
              <text x="75" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">SHA-256 Lock</text>
              <text x="75" y="70" textAnchor="middle" fill="#38bdf8" fontSize="10">Redis / Postgres Check</text>
            </g>

            {/* Arrow 2 */}
            <path d="M375 95 L415 95" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="415,95 407,90 407,100" fill="#3b82f6" />

            {/* Step 3: Outbound HTTPS Dispatcher */}
            <g transform="translate(420, 50)">
              <rect width="150" height="90" rx="8" fill="#141c28" stroke="#10b981" strokeWidth="1.5" />
              <text x="75" y="32" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">OUTBOUND GATEWAY</text>
              <text x="75" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">HTTPS Dispatch</text>
              <text x="75" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">8s Abort Deadline</text>
            </g>

            {/* Arrow 3 to 3rd Party */}
            <path d="M570 95 L610 95" stroke="#10b981" strokeWidth="2" />
            <polygon points="610,95 602,90 602,100" fill="#10b981" />

            {/* Step 4: Third Party Provider */}
            <g transform="translate(615, 50)">
              <rect width="140" height="90" rx="8" fill="#141c28" stroke="#334155" strokeWidth="1.5" />
              <text x="70" y="32" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="600">UPSTREAM VENDOR</text>
              <text x="70" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">External API</text>
              <text x="70" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">Stripe / Twilio / CRM</text>
            </g>

            {/* Circuit Breaker & Queue Fallback Loop */}
            <path d="M495 140 L495 195 L225 195" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="225,195 233,190 233,200" fill="#ef4444" />
            
            <g transform="translate(40, 165)">
              <rect width="180" height="60" rx="8" fill="#1e1b2e" stroke="#dc2626" strokeWidth="1.5" />
              <text x="90" y="26" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="600">FAILOVER &amp; RESILIENCE</text>
              <text x="90" y="44" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="700">BullMQ + Jitter Retries</text>
            </g>

            {/* Telemetry Indicator */}
            <g transform="translate(615, 175)">
              <rect width="265" height="50" rx="6" fill="#111827" stroke="#1e293b" />
              <circle cx="20" cy="25" r="4" fill="#10b981" />
              <text x="35" y="28" fill="#e2e8f0" fontSize="11" fontWeight="500">Zero duplicate transactions guaranteed</text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.1: VENIZOR production pattern for resilient, zero-data-loss outbound and inbound HTTPS API mutations.
          </figcaption>
        </figure>
      );

    case "production-ready-ai-rag-hybrid-search":
      return (
        <figure className="blog-diagram-card" aria-label="RAG and Hybrid Vector Search Architecture">
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">Production RAG &amp; Hybrid Vector Search Pipeline</span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <rect width="920" height="280" rx="12" fill="#0c1017" />
            
            {/* User Prompt */}
            <g transform="translate(30, 50)">
              <rect width="130" height="85" rx="8" fill="#141c28" stroke="#1d2c3f" strokeWidth="1.5" />
              <text x="65" y="30" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">QUERY INGEST</text>
              <text x="65" y="50" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">User Prompt</text>
              <text x="65" y="68" textAnchor="middle" fill="#94a3b8" fontSize="10">Natural Language</text>
            </g>

            {/* Arrow */}
            <path d="M160 92 L200 92" stroke="#3b82f6" strokeWidth="2" />
            <polygon points="200,92 192,87 192,97" fill="#3b82f6" />

            {/* Semantic Cache */}
            <g transform="translate(205, 50)">
              <rect width="140" height="85" rx="8" fill="#141c28" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="70" y="30" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="600">CACHE LAYER</text>
              <text x="70" y="50" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">Semantic Cache</text>
              <text x="70" y="68" textAnchor="middle" fill="#a78bfa" fontSize="10">Redis pgvector &lt;15ms</text>
            </g>

            {/* Arrow */}
            <path d="M345 92 L385 92" stroke="#8b5cf6" strokeWidth="2" />
            <polygon points="385,92 377,87 377,97" fill="#8b5cf6" />

            {/* Hybrid Retrieval (pgvector + BM25) */}
            <g transform="translate(390, 35)">
              <rect width="170" height="115" rx="8" fill="#141c28" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="85" y="26" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">HYBRID RETRIEVAL</text>
              <text x="85" y="48" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">pgvector + BM25</text>
              <text x="85" y="68" textAnchor="middle" fill="#94a3b8" fontSize="10">Cosine Distance + Fulltext</text>
              <rect x="20" y="80" width="130" height="22" rx="4" fill="#0369a1" />
              <text x="85" y="95" textAnchor="middle" fill="#f0f9ff" fontSize="9" fontWeight="600">Reciprocal Rank Fusion</text>
            </g>

            {/* Arrow */}
            <path d="M560 92 L600 92" stroke="#0ea5e9" strokeWidth="2" />
            <polygon points="600,92 592,87 592,97" fill="#0ea5e9" />

            {/* LLM Cascade */}
            <g transform="translate(605, 50)">
              <rect width="140" height="85" rx="8" fill="#141c28" stroke="#10b981" strokeWidth="1.5" />
              <text x="70" y="30" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">INFERENCE ENGINE</text>
              <text x="70" y="50" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">Model Cascade</text>
              <text x="70" y="68" textAnchor="middle" fill="#94a3b8" fontSize="10">Claude 3.5 / GPT-4o</text>
            </g>

            {/* Arrow */}
            <path d="M745 92 L785 92" stroke="#10b981" strokeWidth="2" />
            <polygon points="785,92 777,87 777,97" fill="#10b981" />

            {/* Guardrail & Streamed SSE */}
            <g transform="translate(790, 50)">
              <rect width="105" height="85" rx="8" fill="#141c28" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="52" y="30" textAnchor="middle" fill="#fcd34d" fontSize="10" fontWeight="600">GUARDRAIL</text>
              <text x="52" y="50" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">JSON / SSE</text>
              <text x="52" y="68" textAnchor="middle" fill="#94a3b8" fontSize="9">Streaming</text>
            </g>

            {/* Bottom Telemetry Strip */}
            <g transform="translate(30, 180)">
              <rect width="865" height="65" rx="8" fill="#111827" stroke="#1f2937" />
              <text x="30" y="36" fill="#f8fafc" fontSize="12" fontWeight="600">Production Metrics:</text>
              <text x="170" y="36" fill="#38bdf8" fontSize="12">P95 Retrieval Latency: 42ms</text>
              <text x="420" y="36" fill="#34d399" fontSize="12">Semantic Cache Hit Rate: 34%</text>
              <text x="680" y="36" fill="#a78bfa" fontSize="12">Zero hallucinated schemas</text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.2: VENIZOR production AI architecture combining hybrid search, deterministic guardrails, and model cascade fallback.
          </figcaption>
        </figure>
      );

    case "postgresql-under-high-load-pgbouncer-indexing":
      return (
        <figure className="blog-diagram-card" aria-label="PostgreSQL High Load Pooling Architecture">
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">High-Concurrency PostgreSQL Pooling &amp; Query Topology</span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <rect width="920" height="280" rx="12" fill="#0c1017" />
            
            {/* App Replicas */}
            <g transform="translate(40, 50)">
              <rect width="140" height="90" rx="8" fill="#141c28" stroke="#1d2c3f" strokeWidth="1.5" />
              <text x="70" y="32" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">APP REPLICAS</text>
              <text x="70" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">10,000+ Concurrency</text>
              <text x="70" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">Stateless Containers</text>
            </g>

            {/* Arrow */}
            <path d="M180 95 L230 95" stroke="#3b82f6" strokeWidth="2" />
            <polygon points="230,95 222,90 222,100" fill="#3b82f6" />

            {/* PgBouncer Pooler */}
            <g transform="translate(235, 40)">
              <rect width="180" height="110" rx="8" fill="#141c28" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="90" y="30" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="600">CONNECTION POOLER</text>
              <text x="90" y="52" textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="700">PgBouncer (Transaction)</text>
              <text x="90" y="72" textAnchor="middle" fill="#38bdf8" fontSize="10">200 Backend Sockets</text>
              <rect x="25" y="82" width="130" height="20" rx="4" fill="#1e3a8a" />
              <text x="90" y="96" textAnchor="middle" fill="#dbeafe" fontSize="9" fontWeight="600">Memory: 20MB vs 20GB</text>
            </g>

            {/* Arrow */}
            <path d="M415 95 L475 95" stroke="#3b82f6" strokeWidth="2" />
            <polygon points="475,95 467,90 467,100" fill="#3b82f6" />

            {/* Primary DB */}
            <g transform="translate(480, 25)">
              <rect width="180" height="70" rx="8" fill="#141c28" stroke="#10b981" strokeWidth="1.5" />
              <text x="90" y="26" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">PRIMARY NODE (R/W)</text>
              <text x="90" y="45" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">Write Master</text>
              <text x="90" y="60" textAnchor="middle" fill="#94a3b8" fontSize="9">WAL Streaming Replication</text>
            </g>

            {/* Read Replica */}
            <g transform="translate(480, 105)">
              <rect width="180" height="70" rx="8" fill="#141c28" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="90" y="26" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="600">READ REPLICAS (RO)</text>
              <text x="90" y="45" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">Partial B-Tree Indexes</text>
              <text x="90" y="60" textAnchor="middle" fill="#94a3b8" fontSize="9">Zero Sequential Table Scans</text>
            </g>

            {/* Query Profiling & Optimization */}
            <g transform="translate(690, 50)">
              <rect width="190" height="90" rx="8" fill="#1e1b2e" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="95" y="32" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="600">TELEMETRY &amp; PROFILING</text>
              <text x="95" y="52" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">EXPLAIN ANALYZE</text>
              <text x="95" y="70" textAnchor="middle" fill="#a78bfa" fontSize="10">Buffer Hit Ratio: 99.8%</text>
            </g>

            {/* Bottom Bar */}
            <g transform="translate(40, 190)">
              <rect width="840" height="55" rx="8" fill="#111827" stroke="#1f2937" />
              <text x="30" y="33" fill="#f8fafc" fontSize="12" fontWeight="600">Architecture Advantage:</text>
              <text x="210" y="33" fill="#38bdf8" fontSize="12">Maintains flat 6ms latency under 100x traffic surges</text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.3: Scalable PostgreSQL architecture pairing transaction-level pooling with targeted partial indexing.
          </figcaption>
        </figure>
      );

    case "zero-downtime-releases-docker-cloudflare":
      return (
        <figure className="blog-diagram-card" aria-label="Zero-Downtime Deployment Architecture">
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">Edge-to-Container Blue/Green Deployment Pipeline</span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <rect width="920" height="280" rx="12" fill="#0c1017" />
            
            {/* CI/CD Step */}
            <g transform="translate(40, 50)">
              <rect width="150" height="90" rx="8" fill="#141c28" stroke="#1d2c3f" strokeWidth="1.5" />
              <text x="75" y="32" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">AUTOMATED CI/CD</text>
              <text x="75" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">GitHub Actions</text>
              <text x="75" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">Lint + Tests + SBOM</text>
            </g>

            {/* Arrow */}
            <path d="M190 95 L240 95" stroke="#3b82f6" strokeWidth="2" />
            <polygon points="240,95 232,90 232,100" fill="#3b82f6" />

            {/* Multi-stage Docker */}
            <g transform="translate(245, 50)">
              <rect width="170" height="90" rx="8" fill="#141c28" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="85" y="32" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">CONTAINER LAYER</text>
              <text x="85" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">Multi-Stage Docker</text>
              <text x="85" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">Distroless Image &lt;80MB</text>
            </g>

            {/* Arrow */}
            <path d="M415 95 L465 95" stroke="#0ea5e9" strokeWidth="2" />
            <polygon points="465,95 457,90 457,100" fill="#0ea5e9" />

            {/* Cloudflare Worker Router */}
            <g transform="translate(470, 35)">
              <rect width="180" height="120" rx="8" fill="#141c28" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="90" y="28" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">EDGE ROUTING</text>
              <text x="90" y="48" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">Cloudflare Workers</text>
              <text x="90" y="68" textAnchor="middle" fill="#fde68a" fontSize="10">Canary Traffic Shifting</text>
              <rect x="20" y="80" width="140" height="26" rx="4" fill="#78350f" />
              <text x="90" y="97" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="600">Instant Rollback on 5xx</text>
            </g>

            {/* Arrow */}
            <path d="M650 95 L700 95" stroke="#f59e0b" strokeWidth="2" />
            <polygon points="700,95 692,90 692,100" fill="#f59e0b" />

            {/* Production Fleet */}
            <g transform="translate(705, 50)">
              <rect width="175" height="90" rx="8" fill="#141c28" stroke="#10b981" strokeWidth="1.5" />
              <text x="87" y="32" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">ZERO DOWNTIME</text>
              <text x="87" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">Green Fleet Live</text>
              <text x="87" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">0 Lost HTTP Requests</text>
            </g>

            {/* Telemetry bottom */}
            <g transform="translate(40, 185)">
              <rect width="840" height="60" rx="8" fill="#111827" stroke="#1f2937" />
              <text x="30" y="35" fill="#f8fafc" fontSize="12" fontWeight="600">Deployment SLA:</text>
              <text x="170" y="35" fill="#34d399" fontSize="12">100% Zero-Downtime Deployments across 500+ releases</text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.4: Blue/green canary release matrix automated with edge traffic steering and automated rollbacks.
          </figcaption>
        </figure>
      );

    case "hardening-full-stack-web-applications-owasp":
      return (
        <figure className="blog-diagram-card" aria-label="Zero-Trust Application Security Architecture">
          <div className="diagram-header">
            <span className="diagram-tag">SECURITY MATRIX</span>
            <span className="diagram-title">Defense-in-Depth Full Stack Application Hardening</span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <rect width="920" height="280" rx="12" fill="#0c1017" />
            
            {/* Perimeter */}
            <g transform="translate(40, 50)">
              <rect width="150" height="90" rx="8" fill="#141c28" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="75" y="32" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="600">PERIMETER</text>
              <text x="75" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">WAF &amp; Strict CSP</text>
              <text x="75" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">Rate Limiting + GeoIP</text>
            </g>

            <path d="M190 95 L235 95" stroke="#3b82f6" strokeWidth="2" />
            <polygon points="235,95 227,90 227,100" fill="#3b82f6" />

            {/* Auth Layer */}
            <g transform="translate(240, 50)">
              <rect width="170" height="90" rx="8" fill="#141c28" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="85" y="32" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="600">AUTHENTICATION</text>
              <text x="85" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">Rotating JWT &amp; Sessions</text>
              <text x="85" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">HttpOnly + Secure Cookies</text>
            </g>

            <path d="M410 95 L455 95" stroke="#8b5cf6" strokeWidth="2" />
            <polygon points="455,95 447,90 447,100" fill="#8b5cf6" />

            {/* Validation Layer */}
            <g transform="translate(460, 50)">
              <rect width="180" height="90" rx="8" fill="#141c28" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="90" y="32" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">API GATEWAY</text>
              <text x="90" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">Strict Runtime Schema</text>
              <text x="90" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">Zod / TypeBox Input Sanitization</text>
            </g>

            <path d="M640 95 L685 95" stroke="#0ea5e9" strokeWidth="2" />
            <polygon points="685,95 677,90 677,100" fill="#0ea5e9" />

            {/* Data Layer */}
            <g transform="translate(690, 50)">
              <rect width="190" height="90" rx="8" fill="#141c28" stroke="#10b981" strokeWidth="1.5" />
              <text x="95" y="32" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">DATA PRIVACY</text>
              <text x="95" y="52" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">AES-256 Encryption</text>
              <text x="95" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">Zero plain-text secret storage</text>
            </g>

            {/* Bottom Telemetry */}
            <g transform="translate(40, 185)">
              <rect width="840" height="60" rx="8" fill="#111827" stroke="#1f2937" />
              <text x="30" y="35" fill="#f8fafc" fontSize="12" fontWeight="600">Security Standard:</text>
              <text x="180" y="35" fill="#38bdf8" fontSize="12">OWASP Top 10 compliance &amp; automated dependency CVE auditing in CI</text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.5: Zero-trust perimeter defense implemented across web applications built by VENIZOR.
          </figcaption>
        </figure>
      );

    case "the-2026-growth-engine-seo-aeo-geo-sxo":
    default:
      return (
        <figure className="blog-diagram-card" aria-label="Modern Discovery Optimization Funnel">
          <div className="diagram-header">
            <span className="diagram-tag">SEARCH REVOLUTION</span>
            <span className="diagram-title">The Unified Discovery &amp; Conversion Pipeline (SEO, AEO, GEO, SXO)</span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <rect width="920" height="280" rx="12" fill="#0c1017" />
            
            {/* Channel 1: Traditional Search */}
            <g transform="translate(40, 40)">
              <rect width="180" height="70" rx="8" fill="#141c28" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="90" y="26" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="600">SEO CRAWLERS</text>
              <text x="90" y="46" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">Google / Bing</text>
              <text x="90" y="60" textAnchor="middle" fill="#94a3b8" fontSize="9">Sitemaps &amp; Canonicals</text>
            </g>

            {/* Channel 2: AI & LLMs */}
            <g transform="translate(40, 130)">
              <rect width="180" height="70" rx="8" fill="#141c28" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="90" y="26" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="600">AEO &amp; GEO BOTS</text>
              <text x="90" y="46" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">Perplexity / ChatGPT</text>
              <text x="90" y="60" textAnchor="middle" fill="#94a3b8" fontSize="9">llms.txt &amp; JSON-LD</text>
            </g>

            {/* Merging pathways */}
            <path d="M220 75 L320 120" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M220 165 L320 120" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" />

            {/* The Experience Layer */}
            <g transform="translate(325, 65)">
              <rect width="260" height="110" rx="10" fill="#141c28" stroke="#0ea5e9" strokeWidth="2" />
              <text x="130" y="32" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="700">SXO EXPERIENCE LAYER</text>
              <text x="130" y="56" textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="800">Sub-100ms Interactions</text>
              <text x="130" y="78" textAnchor="middle" fill="#94a3b8" fontSize="11">Zero CLS • Thumb Ergonomics</text>
              <text x="130" y="96" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">Instant Context &amp; Rich Typography</text>
            </g>

            {/* Final Arrow */}
            <path d="M585 120 L660 120" stroke="#10b981" strokeWidth="2.5" />
            <polygon points="660,120 650,114 650,126" fill="#10b981" />

            {/* Conversion Result */}
            <g transform="translate(665, 65)">
              <rect width="215" height="110" rx="10" fill="#141c28" stroke="#10b981" strokeWidth="2" />
              <text x="107" y="32" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="700">CONVERSION OUTCOME</text>
              <text x="107" y="56" textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="800">Qualified Inbound</text>
              <text x="107" y="78" textAnchor="middle" fill="#94a3b8" fontSize="11">Architecture Discovery Calls</text>
              <text x="107" y="96" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="600">Enterprise Contracts</text>
            </g>

            {/* Bottom summary */}
            <g transform="translate(40, 220)">
              <text x="460" y="20" textAnchor="middle" fill="#94a3b8" fontSize="12">
                Discovery is no longer just ranking on page 1. It is being quoted by AI models and delivering instantaneous visitor value.
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.6: The modern multi-channel discovery and conversion pipeline engineered by VENIZOR.
          </figcaption>
        </figure>
      );
  }
}
