"use client";

interface DiagramProps {
  slug: string;
}

export function BlogArchitectureDiagram({ slug }: DiagramProps) {
  switch (slug) {
    case "connecting-third-party-https-apis":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="Webhook and API Idempotency Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">
              Resilient HTTPS API &amp; Idempotency Pipeline
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* Step 1: Inbound Request */}
            <g transform="translate(40, 50)">
              <rect
                width="140"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
                strokeWidth="1.5"
              />
              <text
                x="70"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                INBOUND CLIENT
              </text>
              <text
                x="70"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                Mutation API
              </text>
              <text
                x="70"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                e.g. Stripe Checkout
              </text>
            </g>

            {/* Arrow 1 */}
            <path
              d="M180 95 L220 95"
              stroke="var(--blue)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <polygon points="220,95 212,90 212,100" fill="var(--blue)" />

            {/* Step 2: Idempotency Key Lock */}
            <g transform="translate(225, 50)">
              <rect
                width="150"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="75"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                CRYPTO LAYER
              </text>
              <text
                x="75"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                SHA-256 Lock
              </text>
              <text
                x="75"
                y="70"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Redis / Postgres Check
              </text>
            </g>

            {/* Arrow 2 */}
            <path
              d="M375 95 L415 95"
              stroke="var(--blue)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <polygon points="415,95 407,90 407,100" fill="var(--blue)" />

            {/* Step 3: Outbound HTTPS Dispatcher */}
            <g transform="translate(420, 50)">
              <rect
                width="150"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="75"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                OUTBOUND GATEWAY
              </text>
              <text
                x="75"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                HTTPS Dispatch
              </text>
              <text
                x="75"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                8s Abort Deadline
              </text>
            </g>

            {/* Arrow 3 to 3rd Party */}
            <path d="M570 95 L610 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="610,95 602,90 602,100" fill="var(--blue)" />

            {/* Step 4: Third Party Provider */}
            <g transform="translate(615, 50)">
              <rect
                width="140"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
                strokeWidth="1.5"
              />
              <text
                x="70"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                UPSTREAM VENDOR
              </text>
              <text
                x="70"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                External API
              </text>
              <text
                x="70"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Stripe / Twilio / CRM
              </text>
            </g>

            {/* Circuit Breaker & Queue Fallback Loop */}
            <path
              d="M495 140 L495 195 L225 195"
              stroke="var(--blue)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <polygon points="225,195 233,190 233,200" fill="var(--blue)" />

            <g transform="translate(40, 165)">
              <rect
                width="180"
                height="60"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="90"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                FAILOVER &amp; RESILIENCE
              </text>
              <text
                x="90"
                y="44"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="12"
                fontWeight="700"
              >
                BullMQ + Jitter Retries
              </text>
            </g>

            {/* Telemetry Indicator */}
            <g transform="translate(615, 175)">
              <rect
                width="265"
                height="50"
                rx="6"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
              />
              <circle cx="20" cy="25" r="4" fill="var(--blue)" />
              <text
                x="35"
                y="28"
                fill="var(--ink)"
                fontSize="11"
                fontWeight="500"
              >
                Idempotency and reconciliation checks
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.1: Illustrative design pattern for resilient, recoverable
            outbound and inbound HTTPS API mutations.
          </figcaption>
        </figure>
      );

    case "production-ready-ai-rag-hybrid-search":
    case "integrating-production-ai-workflows":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="RAG and Hybrid Vector Search Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">
              Production RAG &amp; Hybrid Vector Search Pipeline
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* User Prompt */}
            <g transform="translate(30, 50)">
              <rect
                width="130"
                height="85"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
                strokeWidth="1.5"
              />
              <text
                x="65"
                y="30"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                QUERY INGEST
              </text>
              <text
                x="65"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                User Prompt
              </text>
              <text
                x="65"
                y="68"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Natural Language
              </text>
            </g>

            {/* Arrow */}
            <path d="M160 92 L200 92" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="200,92 192,87 192,97" fill="var(--blue)" />

            {/* Semantic Cache */}
            <g transform="translate(205, 50)">
              <rect
                width="140"
                height="85"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="70"
                y="30"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                CACHE LAYER
              </text>
              <text
                x="70"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                Semantic Cache
              </text>
              <text
                x="70"
                y="68"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Redis pgvector &lt;15ms
              </text>
            </g>

            {/* Arrow */}
            <path d="M345 92 L385 92" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="385,92 377,87 377,97" fill="var(--blue)" />

            {/* Hybrid Retrieval (pgvector + BM25) */}
            <g transform="translate(390, 35)">
              <rect
                width="170"
                height="115"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="85"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                HYBRID RETRIEVAL
              </text>
              <text
                x="85"
                y="48"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                pgvector + BM25
              </text>
              <text
                x="85"
                y="68"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Cosine Distance + Fulltext
              </text>
              <rect
                x="20"
                y="80"
                width="130"
                height="22"
                rx="4"
                fill="var(--blue)"
              />
              <text
                x="85"
                y="95"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="9"
                fontWeight="600"
              >
                Reciprocal Rank Fusion
              </text>
            </g>

            {/* Arrow */}
            <path d="M560 92 L600 92" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="600,92 592,87 592,97" fill="var(--blue)" />

            {/* LLM Cascade */}
            <g transform="translate(605, 50)">
              <rect
                width="140"
                height="85"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="70"
                y="30"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                INFERENCE ENGINE
              </text>
              <text
                x="70"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                Model Cascade
              </text>
              <text
                x="70"
                y="68"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Claude 3.5 / GPT-4o
              </text>
            </g>

            {/* Arrow */}
            <path d="M745 92 L785 92" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="785,92 777,87 777,97" fill="var(--blue)" />

            {/* Guardrail & Streamed SSE */}
            <g transform="translate(790, 50)">
              <rect
                width="105"
                height="85"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="52"
                y="30"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                GUARDRAIL
              </text>
              <text
                x="52"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                JSON / SSE
              </text>
              <text
                x="52"
                y="68"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
              >
                Streaming
              </text>
            </g>

            {/* Bottom Telemetry Strip */}
            <g transform="translate(30, 180)">
              <rect
                width="865"
                height="65"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
              />
              <text
                x="30"
                y="36"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="600"
              >
                Production Metrics:
              </text>
              <text x="170" y="36" fill="var(--blue)" fontSize="12">
                P95 Retrieval Latency: 42ms
              </text>
              <text x="420" y="36" fill="var(--blue)" fontSize="12">
                Semantic Cache Hit Rate: 34%
              </text>
              <text x="680" y="36" fill="var(--blue)" fontSize="12">
                Zero hallucinated schemas
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.2: VENIZOR production AI architecture combining hybrid
            search, deterministic guardrails, and model cascade fallback.
          </figcaption>
        </figure>
      );

    case "postgresql-under-high-load-pgbouncer-indexing":
    case "postgresql-at-scale-connection-pooling":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="PostgreSQL High Load Pooling Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">
              High-Concurrency PostgreSQL Pooling &amp; Query Topology
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* App Replicas */}
            <g transform="translate(40, 50)">
              <rect
                width="140"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
                strokeWidth="1.5"
              />
              <text
                x="70"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                APP REPLICAS
              </text>
              <text
                x="70"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                10,000+ Concurrency
              </text>
              <text
                x="70"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Stateless Containers
              </text>
            </g>

            {/* Arrow */}
            <path d="M180 95 L230 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="230,95 222,90 222,100" fill="var(--blue)" />

            {/* PgBouncer Pooler */}
            <g transform="translate(235, 40)">
              <rect
                width="180"
                height="110"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="90"
                y="30"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                CONNECTION POOLER
              </text>
              <text
                x="90"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="14"
                fontWeight="700"
              >
                PgBouncer (Transaction)
              </text>
              <text
                x="90"
                y="72"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                200 Backend Sockets
              </text>
              <rect
                x="25"
                y="82"
                width="130"
                height="20"
                rx="4"
                fill="var(--blue)"
              />
              <text
                x="90"
                y="96"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
                fontWeight="600"
              >
                Memory: 20MB vs 20GB
              </text>
            </g>

            {/* Arrow */}
            <path d="M415 95 L475 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="475,95 467,90 467,100" fill="var(--blue)" />

            {/* Primary DB */}
            <g transform="translate(480, 25)">
              <rect
                width="180"
                height="70"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="90"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                PRIMARY NODE (R/W)
              </text>
              <text
                x="90"
                y="45"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                Write Master
              </text>
              <text
                x="90"
                y="60"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
              >
                WAL Streaming Replication
              </text>
            </g>

            {/* Read Replica */}
            <g transform="translate(480, 105)">
              <rect
                width="180"
                height="70"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="90"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                READ REPLICAS (RO)
              </text>
              <text
                x="90"
                y="45"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                Partial B-Tree Indexes
              </text>
              <text
                x="90"
                y="60"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
              >
                Zero Sequential Table Scans
              </text>
            </g>

            {/* Query Profiling & Optimization */}
            <g transform="translate(690, 50)">
              <rect
                width="190"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="95"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                TELEMETRY &amp; PROFILING
              </text>
              <text
                x="95"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                EXPLAIN ANALYZE
              </text>
              <text
                x="95"
                y="70"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Buffer Hit Ratio: 99.8%
              </text>
            </g>

            {/* Bottom Bar */}
            <g transform="translate(40, 190)">
              <rect
                width="840"
                height="55"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
              />
              <text
                x="30"
                y="33"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="600"
              >
                Architecture Advantage:
              </text>
              <text x="210" y="33" fill="var(--blue)" fontSize="12">
                Maintains flat 6ms latency under 100x traffic surges
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.3: Scalable PostgreSQL architecture pairing
            transaction-level pooling with targeted partial indexing.
          </figcaption>
        </figure>
      );

    case "zero-downtime-releases-docker-cloudflare":
    case "zero-downtime-deployments-devops-playbook":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="Zero-Downtime Deployment Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">
              Edge-to-Container Blue/Green Deployment Pipeline
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* CI/CD Step */}
            <g transform="translate(40, 50)">
              <rect
                width="150"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
                strokeWidth="1.5"
              />
              <text
                x="75"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                AUTOMATED CI/CD
              </text>
              <text
                x="75"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                GitHub Actions
              </text>
              <text
                x="75"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Lint + Tests + SBOM
              </text>
            </g>

            {/* Arrow */}
            <path d="M190 95 L240 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="240,95 232,90 232,100" fill="var(--blue)" />

            {/* Multi-stage Docker */}
            <g transform="translate(245, 50)">
              <rect
                width="170"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="85"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                CONTAINER LAYER
              </text>
              <text
                x="85"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                Multi-Stage Docker
              </text>
              <text
                x="85"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Distroless Image &lt;80MB
              </text>
            </g>

            {/* Arrow */}
            <path d="M415 95 L465 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="465,95 457,90 457,100" fill="var(--blue)" />

            {/* Cloudflare Worker Router */}
            <g transform="translate(470, 35)">
              <rect
                width="180"
                height="120"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="90"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                EDGE ROUTING
              </text>
              <text
                x="90"
                y="48"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                Cloudflare Workers
              </text>
              <text
                x="90"
                y="68"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Canary Traffic Shifting
              </text>
              <rect
                x="20"
                y="80"
                width="140"
                height="26"
                rx="4"
                fill="var(--blue)"
              />
              <text
                x="90"
                y="97"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
                fontWeight="600"
              >
                Instant Rollback on 5xx
              </text>
            </g>

            {/* Arrow */}
            <path d="M650 95 L700 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="700,95 692,90 692,100" fill="var(--blue)" />

            {/* Production Fleet */}
            <g transform="translate(705, 50)">
              <rect
                width="175"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="87"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                ZERO DOWNTIME
              </text>
              <text
                x="87"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                Green Fleet Live
              </text>
              <text
                x="87"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                0 Lost HTTP Requests
              </text>
            </g>

            {/* Telemetry bottom */}
            <g transform="translate(40, 185)">
              <rect
                width="840"
                height="60"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
              />
              <text
                x="30"
                y="35"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="600"
              >
                Deployment SLA:
              </text>
              <text x="170" y="35" fill="var(--blue)" fontSize="12">
                Illustrative release checks and rollback workflow
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.4: Blue/green canary release matrix automated with edge
            traffic steering and automated rollbacks.
          </figcaption>
        </figure>
      );

    case "hardening-full-stack-web-applications-owasp":
    case "hardening-modern-web-applications-security":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="Zero-Trust Application Security Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">SECURITY MATRIX</span>
            <span className="diagram-title">
              Defense-in-Depth Full Stack Application Hardening
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* Perimeter */}
            <g transform="translate(40, 50)">
              <rect
                width="150"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="75"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                PERIMETER
              </text>
              <text
                x="75"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                WAF &amp; Strict CSP
              </text>
              <text
                x="75"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Rate Limiting + GeoIP
              </text>
            </g>

            <path d="M190 95 L235 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="235,95 227,90 227,100" fill="var(--blue)" />

            {/* Auth Layer */}
            <g transform="translate(240, 50)">
              <rect
                width="170"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="85"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                AUTHENTICATION
              </text>
              <text
                x="85"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                Rotating JWT &amp; Sessions
              </text>
              <text
                x="85"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                HttpOnly + Secure Cookies
              </text>
            </g>

            <path d="M410 95 L455 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="455,95 447,90 447,100" fill="var(--blue)" />

            {/* Validation Layer */}
            <g transform="translate(460, 50)">
              <rect
                width="180"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="90"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                API GATEWAY
              </text>
              <text
                x="90"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                Strict Runtime Schema
              </text>
              <text
                x="90"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Zod / TypeBox Input Sanitization
              </text>
            </g>

            <path d="M640 95 L685 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="685,95 677,90 677,100" fill="var(--blue)" />

            {/* Data Layer */}
            <g transform="translate(690, 50)">
              <rect
                width="190"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="95"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                DATA PRIVACY
              </text>
              <text
                x="95"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                AES-256 Encryption
              </text>
              <text
                x="95"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Plan encrypted secret storage
              </text>
            </g>

            {/* Bottom Telemetry */}
            <g transform="translate(40, 185)">
              <rect
                width="840"
                height="60"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
              />
              <text
                x="30"
                y="35"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="600"
              >
                Security Standard:
              </text>
              <text x="180" y="35" fill="var(--blue)" fontSize="12">
                OWASP Top 10 review &amp; automated dependency CVE auditing in
                CI
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.5: Zero-trust perimeter defense implemented across web
            applications built by VENIZOR.
          </figcaption>
        </figure>
      );

    case "the-2026-growth-engine-seo-aeo-geo-sxo":
    case "mastering-seo-aeo-geo-sxo-2026":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="Modern Discovery Optimization Funnel"
        >
          <div className="diagram-header">
            <span className="diagram-tag">SEARCH REVOLUTION</span>
            <span className="diagram-title">
              The Unified Discovery &amp; Conversion Pipeline (SEO, AEO, GEO,
              SXO)
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* Channel 1: Traditional Search */}
            <g transform="translate(40, 40)">
              <rect
                width="180"
                height="70"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="90"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                SEO CRAWLERS
              </text>
              <text
                x="90"
                y="46"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                Google / Bing
              </text>
              <text
                x="90"
                y="60"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
              >
                Sitemaps &amp; Canonicals
              </text>
            </g>

            {/* Channel 2: AI & LLMs */}
            <g transform="translate(40, 130)">
              <rect
                width="180"
                height="70"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="90"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="600"
              >
                AEO &amp; GEO BOTS
              </text>
              <text
                x="90"
                y="46"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="700"
              >
                Perplexity / ChatGPT
              </text>
              <text
                x="90"
                y="60"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
              >
                llms.txt &amp; JSON-LD
              </text>
            </g>

            {/* Merging pathways */}
            <path
              d="M220 75 L320 120"
              stroke="var(--blue)"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <path
              d="M220 165 L320 120"
              stroke="var(--blue)"
              strokeWidth="2"
              strokeDasharray="3 3"
            />

            {/* The Experience Layer */}
            <g transform="translate(325, 65)">
              <rect
                width="260"
                height="110"
                rx="10"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="2"
              />
              <text
                x="130"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="12"
                fontWeight="700"
              >
                SXO EXPERIENCE LAYER
              </text>
              <text
                x="130"
                y="56"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="14"
                fontWeight="800"
              >
                Responsive Interactions
              </text>
              <text
                x="130"
                y="78"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Stable layouts • Thumb Ergonomics
              </text>
              <text
                x="130"
                y="96"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                Instant Context &amp; Rich Typography
              </text>
            </g>

            {/* Final Arrow */}
            <path
              d="M585 120 L660 120"
              stroke="var(--blue)"
              strokeWidth="2.5"
            />
            <polygon points="660,120 650,114 650,126" fill="var(--blue)" />

            {/* Conversion Result */}
            <g transform="translate(665, 65)">
              <rect
                width="215"
                height="110"
                rx="10"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="2"
              />
              <text
                x="107"
                y="32"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="12"
                fontWeight="700"
              >
                CONVERSION OUTCOME
              </text>
              <text
                x="107"
                y="56"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="14"
                fontWeight="800"
              >
                Qualified Inbound
              </text>
              <text
                x="107"
                y="78"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Architecture Discovery Calls
              </text>
              <text
                x="107"
                y="96"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                Enterprise Contracts
              </text>
            </g>

            {/* Bottom summary */}
            <g transform="translate(40, 220)">
              <text
                x="460"
                y="20"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="12"
              >
                Discovery is no longer just ranking on page 1. It is being
                quoted by AI models and delivering instantaneous visitor value.
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.6: The modern multi-channel discovery and conversion
            pipeline engineered by VENIZOR.
          </figcaption>
        </figure>
      );

    case "the-race-to-superintelligence-asi-hardware-frontiers":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="Superintelligence Hardware Substrate Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">
              Superintelligence (ASI) Hardware Substrate &amp; Optical
              Interconnect Topology
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* Sovereign Energy Input */}
            <g transform="translate(30, 45)">
              <rect
                width="130"
                height="110"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="65"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                POWER SUBSTRATE
              </text>
              <text
                x="65"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                5 GW Dedicated
              </text>
              <text
                x="65"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Baseload SMR / Geo
              </text>
              <text
                x="65"
                y="92"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                Zero Grid Lag
              </text>
            </g>

            <path
              d="M160 100 L200 100"
              stroke="var(--blue)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Liquid Cooling Distribution */}
            <g transform="translate(205, 45)">
              <rect
                width="145"
                height="110"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="72"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                THERMAL CONTROL
              </text>
              <text
                x="72"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                Direct-to-Chip
              </text>
              <text
                x="72"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                140 kW / Rack
              </text>
              <text
                x="72"
                y="92"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                Fluorochemical Loop
              </text>
            </g>

            <path d="M350 100 L390 100" stroke="var(--blue)" strokeWidth="2" />

            {/* Optical Switching Fabric */}
            <g transform="translate(395, 45)">
              <rect
                width="180"
                height="110"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="90"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                OPTICAL INTERCONNECT
              </text>
              <text
                x="90"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                Co-Packaged CPO
              </text>
              <text
                x="90"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                3.2 Tbps Cross-Die
              </text>
              <text
                x="90"
                y="92"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                &lt;1.2µs All-to-All
              </text>
            </g>

            <path d="M575 100 L615 100" stroke="var(--blue)" strokeWidth="2" />

            {/* Wafer Scale Accelerators */}
            <g transform="translate(620, 45)">
              <rect
                width="150"
                height="110"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="75"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                COMPUTE CORE
              </text>
              <text
                x="75"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                Wafer-Scale MoE
              </text>
              <text
                x="75"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                HBM4 + On-Chip SRAM
              </text>
              <text
                x="75"
                y="92"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                Test-Time Search
              </text>
            </g>

            <path d="M770 100 L800 100" stroke="var(--blue)" strokeWidth="2" />

            {/* Emergent Reasoning */}
            <g transform="translate(805, 45)">
              <rect
                width="90"
                height="110"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="45"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
                fontWeight="700"
              >
                OUTPUT
              </text>
              <text
                x="45"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="11"
                fontWeight="800"
              >
                ASI Search
              </text>
              <text
                x="45"
                y="72"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Self-Play
              </text>
              <text
                x="45"
                y="92"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Verifiers
              </text>
            </g>

            <g transform="translate(40, 205)">
              <rect
                width="840"
                height="48"
                rx="6"
                fill="var(--surface-soft)"
                stroke="var(--rule)"
              />
              <text
                x="420"
                y="28"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Hardware substrate scaling: Moving compute directly to dedicated
                clean energy with silicon photonics to break the copper
                bisection bandwidth ceiling.
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.7: The physical hardware and optical interconnect topology
            required for Artificial Superintelligence clusters.
          </figcaption>
        </figure>
      );

    case "how-ai-is-evolving-agentic-reasoning-loops":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="Agentic Reasoning Loop Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">
              Autonomous Multi-Agent ReAct Reasoning Loop &amp; MCTS
              Verification
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* User Directive */}
            <g transform="translate(30, 70)">
              <rect
                width="130"
                height="85"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="65"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                USER DIRECTIVE
              </text>
              <text
                x="65"
                y="48"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                Complex Task
              </text>
              <text
                x="65"
                y="66"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Multi-step Goal
              </text>
            </g>

            <path d="M160 112 L200 112" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="200,112 192,107 192,117" fill="var(--blue)" />

            {/* ReAct Planner */}
            <g transform="translate(205, 50)">
              <rect
                width="160"
                height="125"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="2"
              />
              <text
                x="80"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="700"
              >
                REASONING CORE
              </text>
              <text
                x="80"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                ReAct Cycle
              </text>
              <text
                x="80"
                y="70"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                1. Think (Hypothesis)
              </text>
              <text
                x="80"
                y="86"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                2. Act (Tool Call)
              </text>
              <text
                x="80"
                y="102"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                3. Observe &amp; Self-Reflect
              </text>
            </g>

            {/* Forward to Execution */}
            <path d="M365 95 L415 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="415,95 407,90 407,100" fill="var(--blue)" />

            {/* Tool Sandbox */}
            <g transform="translate(420, 50)">
              <rect
                width="160"
                height="125"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="80"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="700"
              >
                TOOL EXECUTION
              </text>
              <text
                x="80"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                Wasm / MicroVM
              </text>
              <text
                x="80"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Git • PostgreSQL • API
              </text>
              <text
                x="80"
                y="90"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Isolated Sandboxing
              </text>
              <text
                x="80"
                y="108"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
              >
                Timeout &amp; Token Bounds
              </text>
            </g>

            {/* Loop Back Reflection Arrow */}
            <path
              d="M500 175 L500 205 L285 205 L285 175"
              stroke="var(--blue)"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <polygon points="285,175 280,183 290,183" fill="var(--blue)" />
            <text
              x="390"
              y="220"
              textAnchor="middle"
              fill="var(--blue)"
              fontSize="10"
              fontWeight="600"
            >
              Iterative Self-Correction &amp; Backtracking Loop
            </text>

            {/* Tree Verifier */}
            <path d="M580 95 L630 95" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="630,95 622,90 622,100" fill="var(--blue)" />

            <g transform="translate(635, 50)">
              <rect
                width="145"
                height="125"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="72"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="700"
              >
                MCTS VERIFIER
              </text>
              <text
                x="72"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                Value Scorer
              </text>
              <text
                x="72"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Branch Pruning
              </text>
              <text
                x="72"
                y="90"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Confidence Threshold
              </text>
              <text
                x="72"
                y="108"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Score &gt;= 0.94
              </text>
            </g>

            <path d="M780 112 L810 112" stroke="var(--blue)" strokeWidth="2" />

            {/* Graph Memory */}
            <g transform="translate(815, 60)">
              <rect
                width="85"
                height="105"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="42"
                y="24"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
                fontWeight="700"
              >
                PERSISTENCE
              </text>
              <text
                x="42"
                y="46"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="11"
                fontWeight="800"
              >
                Graph DB
              </text>
              <text
                x="42"
                y="66"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
              >
                Entity Triple
              </text>
              <text
                x="42"
                y="86"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="8"
              >
                &lt;10ms Sync
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.8: Autonomous agent state machine interleaving ReAct
            cycles, tool sandboxing, and tree search verification.
          </figcaption>
        </figure>
      );

    case "how-big-tech-engineers-hyper-scale-apps":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="Hyper-Scale Systems Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">
              Hyper-Scale Engineering: Uber H3 Mesh, Google Spanner TrueTime
              &amp; Anthropic RLHF
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* Uber H3 Column */}
            <g transform="translate(40, 45)">
              <rect
                width="250"
                height="150"
                rx="10"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="125"
                y="30"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="12"
                fontWeight="700"
              >
                UBER H3 GEO-MESH
              </text>
              <text
                x="125"
                y="55"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="14"
                fontWeight="800"
              >
                Hexagonal Indexing
              </text>
              <text
                x="125"
                y="80"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                World Partitioned to 64-bit Hex Ints
              </text>
              <text
                x="125"
                y="102"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                O(1) Spatial Neighbor Bitmasks
              </text>
              <text
                x="125"
                y="125"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                Zero Haversine Math Overhead
              </text>
            </g>

            {/* Google Spanner Column */}
            <g transform="translate(335, 45)">
              <rect
                width="250"
                height="150"
                rx="10"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="125"
                y="30"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="12"
                fontWeight="700"
              >
                GOOGLE SPANNER
              </text>
              <text
                x="125"
                y="55"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="14"
                fontWeight="800"
              >
                TrueTime API
              </text>
              <text
                x="125"
                y="80"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Atomic Clocks + GPS Antennas in Racks
              </text>
              <text
                x="125"
                y="102"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Bounded Uncertainty: [t.earliest, t.latest]
              </text>
              <text
                x="125"
                y="125"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                Global Strict ACID Without Distributed Locks
              </text>
            </g>

            {/* Anthropic RLHF Column */}
            <g transform="translate(630, 45)">
              <rect
                width="250"
                height="150"
                rx="10"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="125"
                y="30"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="12"
                fontWeight="700"
              >
                ANTHROPIC CONSTITUTIONAL
              </text>
              <text
                x="125"
                y="55"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="14"
                fontWeight="800"
              >
                Automated Alignment
              </text>
              <text
                x="125"
                y="80"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Second Evaluator LLM as Supreme Court
              </text>
              <text
                x="125"
                y="102"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Critique ➔ Revision ➔ Preference Ranking
              </text>
              <text
                x="125"
                y="125"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="600"
              >
                Multi-Turn Safety Verification
              </text>
            </g>

            {/* Bottom Insight */}
            <g transform="translate(40, 215)">
              <text
                x="440"
                y="20"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Hyper-scale architecture replaces ad-hoc microservices with
                formal physical partitioning, atomic clock intervals, and
                automated meta-supervision.
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.9: Architectural teardown of fundamental hyper-scale
            engineering mechanisms.
          </figcaption>
        </figure>
      );

    case "securing-ai-production-systems":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="AI Defense in Depth Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">
              AI Defense-in-Depth: Delimiter Isolation &amp; Sandboxed MicroVM
              Execution
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* Untrusted Data */}
            <g transform="translate(30, 60)">
              <rect
                width="130"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="65"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                UNTRUSTED INPUT
              </text>
              <text
                x="65"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                PDF / Web Text
              </text>
              <text
                x="65"
                y="70"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Potential Injections
              </text>
            </g>

            <path d="M160 105 L200 105" stroke="var(--blue)" strokeWidth="2" />

            {/* Crypto Delimiter Boundary */}
            <g transform="translate(205, 50)">
              <rect
                width="160"
                height="110"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="80"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                SECURITY LAYER 1
              </text>
              <text
                x="80"
                y="48"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="800"
              >
                Random Delimiter
              </text>
              <text
                x="80"
                y="68"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                SHA-256 Nonce Isolation
              </text>
              <text
                x="80"
                y="86"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                &lt;&lt;&lt;INERT_DATA_NONCE&gt;&gt;&gt;
              </text>
              <text
                x="80"
                y="102"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Escape Inner Tokens
              </text>
            </g>

            <path d="M365 105 L405 105" stroke="var(--blue)" strokeWidth="2" />

            {/* Dual Model Inspector */}
            <g transform="translate(410, 50)">
              <rect
                width="160"
                height="110"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="80"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                SECURITY LAYER 2
              </text>
              <text
                x="80"
                y="48"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="800"
              >
                Untrusted Guard Model
              </text>
              <text
                x="80"
                y="68"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Adversarial Classifier
              </text>
              <text
                x="80"
                y="86"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Zero Privilege Context
              </text>
              <text
                x="80"
                y="102"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Safe: Pass ➔ Core Agent
              </text>
            </g>

            <path d="M570 105 L610 105" stroke="var(--blue)" strokeWidth="2" />

            {/* Sandboxed Execution MicroVM */}
            <g transform="translate(615, 50)">
              <rect
                width="160"
                height="110"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="2"
              />
              <text
                x="80"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                SECURITY LAYER 3
              </text>
              <text
                x="80"
                y="48"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="800"
              >
                Firecracker MicroVM
              </text>
              <text
                x="80"
                y="68"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Wasm Isolation
              </text>
              <text
                x="80"
                y="86"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Zero Egress Network
              </text>
              <text
                x="80"
                y="102"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
              >
                Ephemeral 5s Lifecycle
              </text>
            </g>

            <path d="M775 105 L805 105" stroke="var(--blue)" strokeWidth="2" />

            {/* Audit Log */}
            <g transform="translate(810, 60)">
              <rect
                width="90"
                height="90"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="45"
                y="24"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
                fontWeight="700"
              >
                AUDIT
              </text>
              <text
                x="45"
                y="44"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="11"
                fontWeight="800"
              >
                Immutable
              </text>
              <text
                x="45"
                y="62"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Signed Log
              </text>
              <text
                x="45"
                y="80"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="8"
              >
                OWASP Ready
              </text>
            </g>

            <g transform="translate(40, 205)">
              <text
                x="440"
                y="20"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Zero-trust AI: Delimiter randomization isolates instructions
                from raw data while microVM sandboxes contain malicious tool
                execution.
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.10: Complete defense-in-depth security blueprint for
            production autonomous AI systems.
          </figcaption>
        </figure>
      );

    case "solving-the-distributed-dual-write-problem":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="Transactional Outbox CDC Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">
              Atomic Transactional Outbox Pattern with PostgreSQL WAL &amp;
              Debezium CDC
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* Client Mutation */}
            <g transform="translate(30, 80)">
              <rect
                width="120"
                height="80"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="60"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                INBOUND EVENT
              </text>
              <text
                x="60"
                y="48"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
              >
                Order Paid
              </text>
              <text
                x="60"
                y="66"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Mutation API
              </text>
            </g>

            <path d="M150 120 L190 120" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="190,120 182,115 182,125" fill="var(--blue)" />

            {/* PostgreSQL Single ACID Transaction Boundary */}
            <g transform="translate(195, 35)">
              <rect
                width="250"
                height="170"
                rx="10"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text
                x="125"
                y="24"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="800"
              >
                ATOMIC ACID BOUNDARY
              </text>

              {/* Table 1: Domain Entity */}
              <g transform="translate(15, 38)">
                <rect
                  width="220"
                  height="52"
                  rx="6"
                  fill="var(--surface-soft)"
                  stroke="var(--rule)"
                />
                <text
                  x="110"
                  y="20"
                  textAnchor="middle"
                  fill="var(--ink)"
                  fontSize="11"
                  fontWeight="700"
                >
                  1. UPDATE orders SET status=&apos;PAID&apos;
                </text>
                <text
                  x="110"
                  y="38"
                  textAnchor="middle"
                  fill="var(--text-soft)"
                  fontSize="9"
                >
                  Primary Domain Entity State
                </text>
              </g>

              {/* Table 2: Outbox Table */}
              <g transform="translate(15, 100)">
                <rect
                  width="220"
                  height="52"
                  rx="6"
                  fill="var(--surface-soft)"
                  stroke="var(--blue)"
                />
                <text
                  x="110"
                  y="20"
                  textAnchor="middle"
                  fill="var(--blue)"
                  fontSize="11"
                  fontWeight="700"
                >
                  2. INSERT INTO outbox_events
                </text>
                <text
                  x="110"
                  y="38"
                  textAnchor="middle"
                  fill="var(--blue)"
                  fontSize="9"
                >
                  OrderPaidEvent payload jsonb
                </text>
              </g>
            </g>

            <path d="M445 120 L485 120" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="485,120 477,115 477,125" fill="var(--blue)" />

            {/* PostgreSQL WAL */}
            <g transform="translate(490, 60)">
              <rect
                width="130"
                height="120"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="65"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                POSTGRES ENGINE
              </text>
              <text
                x="65"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                Write-Ahead Log
              </text>
              <text
                x="65"
                y="72"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                (WAL Stream)
              </text>
              <text
                x="65"
                y="94"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
              >
                Zero Table Locks
              </text>
              <text
                x="65"
                y="110"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="8"
              >
                &lt;2ms Latency
              </text>
            </g>

            <path d="M620 120 L660 120" stroke="var(--blue)" strokeWidth="2" />

            {/* Debezium CDC Connector */}
            <g transform="translate(665, 60)">
              <rect
                width="115"
                height="120"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="57"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                CDC ENGINE
              </text>
              <text
                x="57"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="800"
              >
                Debezium
              </text>
              <text
                x="57"
                y="72"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Offset Tracking
              </text>
              <text
                x="57"
                y="94"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="9"
              >
                At-Least-Once
              </text>
              <text
                x="57"
                y="110"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="8"
              >
                Auto-Recovery
              </text>
            </g>

            <path d="M780 120 L815 120" stroke="var(--blue)" strokeWidth="2" />

            {/* Kafka Broker */}
            <g transform="translate(820, 60)">
              <rect
                width="85"
                height="120"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="42"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
                fontWeight="700"
              >
                BROKER
              </text>
              <text
                x="42"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="800"
              >
                Kafka
              </text>
              <text
                x="42"
                y="72"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Topic stream
              </text>
              <text
                x="42"
                y="94"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="8"
              >
                Subscribers
              </text>
              <text
                x="42"
                y="110"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="8"
              >
                0% Data Loss
              </text>
            </g>

            <g transform="translate(40, 225)">
              <text
                x="440"
                y="16"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Zero dual-write bugs: The business mutation and the outbound
                event commit atomically inside PostgreSQL, streamed to Kafka via
                WAL Change Data Capture.
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.11: Atomic transactional outbox pattern eliminating
            distributed data inconsistency.
          </figcaption>
        </figure>
      );

    case "how-applications-are-built-in-this-era":
      return (
        <figure
          className="blog-diagram-card"
          aria-label="Modern 2026 Full Stack Architecture"
        >
          <div className="diagram-header">
            <span className="diagram-tag">ARCHITECTURE SCHEMATIC</span>
            <span className="diagram-title">
              The 2026 Modern Application Stack: Edge, Unified PgVector &amp;
              Agentic Workflow
            </span>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 920 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustrative architecture diagram"
          >
            <rect width="920" height="280" rx="12" fill="var(--surface-soft)" />

            {/* Edge Ingress */}
            <g transform="translate(30, 45)">
              <rect
                width="160"
                height="140"
                rx="10"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="80"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="700"
              >
                EDGE INGRESS
              </text>
              <text
                x="80"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                Cloudflare / Bun
              </text>
              <text
                x="80"
                y="74"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Sub-15ms Global Anycast
              </text>
              <text
                x="80"
                y="94"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Server Components (RSC)
              </text>
              <text
                x="80"
                y="114"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Wasm Micro-Services
              </text>
              <text
                x="80"
                y="130"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Evaluate cold-start behavior
              </text>
            </g>

            <path d="M190 115 L240 115" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="240,115 232,110 232,120" fill="var(--blue)" />

            {/* Type-Safe Bridge */}
            <g transform="translate(245, 55)">
              <rect
                width="150"
                height="120"
                rx="8"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="75"
                y="26"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
                fontWeight="700"
              >
                TYPE CONTRACT
              </text>
              <text
                x="75"
                y="48"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                Drizzle + TypeBox
              </text>
              <text
                x="75"
                y="70"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                End-to-End Type Safety
              </text>
              <text
                x="75"
                y="90"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Zero Runtime Drift
              </text>
              <text
                x="75"
                y="108"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Automated Migrations
              </text>
            </g>

            <path d="M395 115 L445 115" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="445,115 437,110 437,120" fill="var(--blue)" />

            {/* Unified PostgreSQL 16+ */}
            <g transform="translate(450, 45)">
              <rect
                width="240"
                height="140"
                rx="10"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="2"
              />
              <text
                x="120"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="700"
              >
                UNIFIED STORAGE LAYER
              </text>
              <text
                x="120"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="14"
                fontWeight="800"
              >
                PostgreSQL 16+
              </text>
              <text
                x="120"
                y="74"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                ACID Relational Tables
              </text>
              <text
                x="120"
                y="94"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                pgvector HNSW Cosine Index
              </text>
              <text
                x="120"
                y="114"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                pg_bm25 Sparse Full-Text
              </text>
              <text
                x="120"
                y="130"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Replaces 4 Separate Databases
              </text>
            </g>

            <path d="M690 115 L740 115" stroke="var(--blue)" strokeWidth="2" />
            <polygon points="740,115 732,110 732,120" fill="var(--blue)" />

            {/* Agentic Dev Tooling */}
            <g transform="translate(745, 45)">
              <rect
                width="145"
                height="140"
                rx="10"
                fill="var(--surface-soft)"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x="72"
                y="28"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="11"
                fontWeight="700"
              >
                DEVELOPMENT
              </text>
              <text
                x="72"
                y="52"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight="800"
              >
                Agentic IDEs
              </text>
              <text
                x="72"
                y="74"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="10"
              >
                Cursor / Antigravity
              </text>
              <text
                x="72"
                y="94"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Reviewable delivery workflow
              </text>
              <text
                x="72"
                y="114"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="10"
              >
                Automated E2E Tests
              </text>
              <text
                x="72"
                y="130"
                textAnchor="middle"
                fill="var(--blue)"
                fontSize="9"
              >
                Craft + Speed
              </text>
            </g>

            <g transform="translate(40, 215)">
              <text
                x="440"
                y="20"
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize="11"
              >
                Radical simplification: Global edge compute combined with
                unified PostgreSQL eliminates microservice sprawl and
                cross-database sync headaches.
              </text>
            </g>
          </svg>
          <figcaption className="diagram-caption">
            Figure 1.12: The 2026 modern production stack delivering extreme
            velocity and sub-15ms edge latency.
          </figcaption>
        </figure>
      );

    default:
      return null;
  }
}
