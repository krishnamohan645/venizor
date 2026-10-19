"use client";

import { ExperienceProvider } from "@/components/experience";
import { PageFooter, PageHeader } from "@/components/page-nav";
import { ResultFollowup } from "@/components/result-followup";
import { Activity, ArrowUpRight, Cpu, Play, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SimMode = "api" | "rag";

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "success";
  text: string;
}

export default function SimulatorPage() {
  const [mode, setMode] = useState<SimMode>("api");

  // API Mode State
  const [networkCondition, setNetworkCondition] = useState<
    "success" | "timeout" | "ratelimit"
  >("timeout");
  const [enableCircuitBreaker, setEnableCircuitBreaker] = useState(true);
  const [apiStep, setApiStep] = useState(0);
  const [apiRunning, setApiRunning] = useState(false);
  const [apiLogs, setApiLogs] = useState<LogEntry[]>([
    {
      timestamp: "00:00.000",
      level: "info",
      text: "Pipeline initialized. Ready to dispatch mutation.",
    },
  ]);

  // RAG Mode State
  const [queryText, setQueryText] = useState(
    "Show payment SLA breach liability clause",
  );
  const [retrievalType, setRetrievalType] = useState<
    "hybrid" | "vector" | "keyword"
  >("hybrid");
  const [enableSemanticCache, setEnableSemanticCache] = useState(true);
  const [ragRunning, setRagRunning] = useState(false);
  const [ragStep, setRagStep] = useState(0);
  const [ragResult, setRagResult] = useState<{
    latency: number;
    cacheHit: boolean;
    precision: number;
    tokens: number;
    response: string;
  } | null>(null);

  // Run API Simulation
  const runApiSimulation = () => {
    if (apiRunning) return;
    setApiRunning(true);
    setApiStep(1);
    setApiLogs([
      {
        timestamp: "00:00.010",
        level: "info",
        text: "Inbound POST /v1/checkout/mutate received from client.",
      },
      {
        timestamp: "00:00.024",
        level: "info",
        text: "Hashing payload into SHA-256 idempotency key: 8f4b2e...c1",
      },
    ]);

    setTimeout(() => {
      setApiStep(2);
      setApiLogs((prev) => [
        ...prev,
        {
          timestamp: "00:00.052",
          level: "info",
          text: "Redis lock acquired for key [idemp:8f4b2e...c1].",
        },
        {
          timestamp: "00:00.078",
          level: "info",
          text: "Dispatching outbound HTTPS POST to upstream vendor API...",
        },
      ]);
    }, 800);

    setTimeout(() => {
      if (networkCondition === "timeout") {
        setApiStep(3);
        setApiLogs((prev) => [
          ...prev,
          {
            timestamp: "00:02.100",
            level: "error",
            text: "Upstream timeout after 2000ms deadline (HTTP 504 Gateway Timeout).",
          },
          enableCircuitBreaker
            ? {
                timestamp: "00:02.120",
                level: "warn",
                text: "Circuit Breaker Active: State changed to HALF-OPEN.",
              }
            : {
                timestamp: "00:02.120",
                level: "error",
                text: "No circuit breaker: thread pool blocked awaiting timeout.",
              },
        ]);

        setTimeout(() => {
          setApiStep(4);
          setApiLogs((prev) => [
            ...prev,
            {
              timestamp: "00:02.350",
              level: "info",
              text: "Enqueued payload into BullMQ background retry queue.",
            },
            {
              timestamp: "00:02.800",
              level: "info",
              text: "Executing exponential backoff with full jitter (Delay: 640ms)...",
            },
            {
              timestamp: "00:03.450",
              level: "success",
              text: "Retry attempt 1 succeeded: Upstream confirmed HTTP 200 OK. Idempotency lock resolved.",
            },
          ]);
          setApiRunning(false);
        }, 1200);
      } else if (networkCondition === "ratelimit") {
        setApiStep(3);
        setApiLogs((prev) => [
          ...prev,
          {
            timestamp: "00:00.410",
            level: "warn",
            text: "Upstream returned HTTP 429 Too Many Requests (Retry-After: 2s).",
          },
          {
            timestamp: "00:00.430",
            level: "info",
            text: "BullMQ queue respecting upstream rate-limit token bucket.",
          },
          {
            timestamp: "00:02.500",
            level: "success",
            text: "Deferred retry dispatched after rate window expired: HTTP 200 OK received.",
          },
        ]);
        setApiRunning(false);
      } else {
        setApiStep(4);
        setApiLogs((prev) => [
          ...prev,
          {
            timestamp: "00:00.280",
            level: "success",
            text: "Upstream returned HTTP 200 OK in 142ms.",
          },
          {
            timestamp: "00:00.295",
            level: "info",
            text: "Result cached against SHA-256 key. Returning response to client.",
          },
        ]);
        setApiRunning(false);
      }
    }, 1800);
  };

  // Run RAG Simulation
  const runRagSimulation = () => {
    if (ragRunning) return;
    setRagRunning(true);
    setRagStep(1);
    setRagResult(null);

    setTimeout(() => {
      setRagStep(2);
    }, 600);

    setTimeout(() => {
      setRagStep(3);
    }, 1200);

    setTimeout(() => {
      setRagStep(4);
      setRagRunning(false);
      setRagResult({
        latency: enableSemanticCache
          ? 38
          : retrievalType === "hybrid"
            ? 142
            : 210,
        cacheHit: enableSemanticCache,
        precision:
          retrievalType === "hybrid"
            ? 98.4
            : retrievalType === "vector"
              ? 82.1
              : 74.6,
        tokens: 342,
        response:
          "Section 14.2: Under standard Enterprise SLA, vendor liability for downtime exceeding 99.9% availability is capped at 15% monthly service credit, calculated per calendar month with zero rollover.",
      });
    }, 2000);
  };

  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">

        <PageHeader activePage="blog" />

        <main id="simulator-main" className="inner-page-main">
          <p className="page-container article-evidence-note">
            Interactive demonstration: outputs are simulated, not measured
            production results.
          </p>
          {/* Hero Section */}
          <section
            className="page-hero page-container"
            aria-labelledby="sim-title"
          >
            <div className="page-hero-kicker">
              <span className="kicker-tag">
                <i className="live-dot" /> LIVE SYSTEM SIMULATOR
              </span>
              <span>
                INTERACTIVE RESILIENCE • TELEMETRY PROFILER • ZERO DATA LOSS
              </span>
            </div>

            <h1 id="sim-title" className="page-hero-title">
              Interactive Architecture <br />
              <span className="hero-title-blue">Pipeline Simulator.</span>
            </h1>

            <p className="page-hero-lead">
              Experience VENIZOR’s production engineering in action. Trigger
              simulated network failures, circuit breaker trips, vector
              embedding searches, and semantic cache lookups with live
              telemetry.
            </p>

            {/* Mode Switcher */}
            <div className="sim-mode-toggle-wrap">
              <button
                type="button"
                className={`sim-mode-btn ${mode === "api" ? "is-active" : ""}`}
                onClick={() => setMode("api")}
              >
                <Zap size={16} /> API &amp; Webhook Resilience Simulator
              </button>
              <button
                type="button"
                className={`sim-mode-btn ${mode === "rag" ? "is-active" : ""}`}
                onClick={() => setMode("rag")}
              >
                <Cpu size={16} /> RAG &amp; Hybrid Vector Search Simulator
              </button>
            </div>
          </section>

          {/* SIMULATOR WORKSPACE */}
          <div className="page-container sim-workspace-container">
            {mode === "api" ? (
              /* API Simulation View */
              <div className="sim-grid">
                {/* Controls */}
                <div className="sim-controls-card">
                  <div className="sim-card-header">
                    <span className="sim-card-tag">TEST CONDITIONS</span>
                    <h3>Inbound Mutation Config</h3>
                  </div>

                  <div className="sim-control-group">
                    <label>Simulated Network Condition</label>
                    <div className="sim-radio-stack">
                      <button
                        type="button"
                        className={`sim-toggle-pill ${networkCondition === "timeout" ? "is-selected" : ""}`}
                        onClick={() => setNetworkCondition("timeout")}
                      >
                        504 Gateway Timeout (Network Drop)
                      </button>
                      <button
                        type="button"
                        className={`sim-toggle-pill ${networkCondition === "ratelimit" ? "is-selected" : ""}`}
                        onClick={() => setNetworkCondition("ratelimit")}
                      >
                        429 Upstream Rate Limit
                      </button>
                      <button
                        type="button"
                        className={`sim-toggle-pill ${networkCondition === "success" ? "is-selected" : ""}`}
                        onClick={() => setNetworkCondition("success")}
                      >
                        200 OK Healthy Network
                      </button>
                    </div>
                  </div>

                  <div className="sim-control-group">
                    <label>Resilience Safeguards</label>
                    <div className="sim-checkbox-row">
                      <input
                        type="checkbox"
                        id="cb-toggle"
                        checked={enableCircuitBreaker}
                        onChange={(e) =>
                          setEnableCircuitBreaker(e.target.checked)
                        }
                      />
                      <label htmlFor="cb-toggle">
                        Active Circuit Breaker &amp; BullMQ Queue
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="pill-button dark sim-trigger-btn"
                    onClick={runApiSimulation}
                    disabled={apiRunning}
                  >
                    {apiRunning ? (
                      <>
                        <Activity className="animate-spin" size={16} />{" "}
                        Processing Pipeline...
                      </>
                    ) : (
                      <>
                        <Play size={16} /> Dispatch HTTPS Mutation
                      </>
                    )}
                  </button>
                </div>

                {/* Pipeline Flow & Terminal */}
                <div className="sim-output-card">
                  <div className="sim-card-header">
                    <span className="sim-card-tag">LIVE EXECUTION STATE</span>
                    <h3>Pipeline Stage Progress</h3>
                  </div>

                  {/* Visual Steps */}
                  <div className="pipeline-visual-track">
                    <div
                      className={`track-node ${apiStep >= 1 ? "active" : ""}`}
                    >
                      <div className="track-dot">1</div>
                      <span>Inbound POST</span>
                    </div>
                    <div
                      className={`track-connector ${apiStep >= 2 ? "active" : ""}`}
                    />
                    <div
                      className={`track-node ${apiStep >= 2 ? "active" : ""}`}
                    >
                      <div className="track-dot">2</div>
                      <span>SHA-256 Lock</span>
                    </div>
                    <div
                      className={`track-connector ${apiStep >= 3 ? "active" : ""}`}
                    />
                    <div
                      className={`track-node ${apiStep >= 3 ? "active" : ""}`}
                    >
                      <div className="track-dot">3</div>
                      <span>Upstream Gateway</span>
                    </div>
                    <div
                      className={`track-connector ${apiStep >= 4 ? "active" : ""}`}
                    />
                    <div
                      className={`track-node ${apiStep >= 4 ? "active" : ""}`}
                    >
                      <div className="track-dot">4</div>
                      <span>Idempotent 200 OK</span>
                    </div>
                  </div>

                  {/* Terminal Logs */}
                  <div className="sim-terminal-wrap">
                    <div className="terminal-bar">
                      <div className="terminal-dots">
                        <span className="t-dot red" />
                        <span className="t-dot yellow" />
                        <span className="t-dot green" />
                      </div>
                      <span className="terminal-title">
                        venizor-gateway-telemetry.log
                      </span>
                    </div>
                    <div
                      className="terminal-body"
                      role="log"
                      aria-live="polite"
                    >
                      {apiLogs.map((log, index) => (
                        <div
                          key={index}
                          className={`terminal-line ${log.level}`}
                        >
                          <span className="line-ts">[{log.timestamp}]</span>
                          <span className="line-text">{log.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* RAG Simulation View */
              <div className="sim-grid">
                {/* Controls */}
                <div className="sim-controls-card">
                  <div className="sim-card-header">
                    <span className="sim-card-tag">RAG PARAMETERS</span>
                    <h3>Enterprise Query Setup</h3>
                  </div>

                  <div className="sim-control-group">
                    <label htmlFor="sim-retrieval-query">User Query</label>
                    <input
                      id="sim-retrieval-query"
                      type="text"
                      className="sim-input"
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                    />
                  </div>

                  <div className="sim-control-group">
                    <label>Retrieval Mechanism</label>
                    <div className="sim-radio-stack">
                      <button
                        type="button"
                        className={`sim-toggle-pill ${retrievalType === "hybrid" ? "is-selected" : ""}`}
                        onClick={() => setRetrievalType("hybrid")}
                      >
                        Hybrid (pgvector HNSW + BM25 Fulltext)
                      </button>
                      <button
                        type="button"
                        className={`sim-toggle-pill ${retrievalType === "vector" ? "is-selected" : ""}`}
                        onClick={() => setRetrievalType("vector")}
                      >
                        Pure Dense Vector (Cosine Distance)
                      </button>
                      <button
                        type="button"
                        className={`sim-toggle-pill ${retrievalType === "keyword" ? "is-selected" : ""}`}
                        onClick={() => setRetrievalType("keyword")}
                      >
                        Pure Keyword Search (BM25)
                      </button>
                    </div>
                  </div>

                  <div className="sim-control-group">
                    <label>Optimization Layers</label>
                    <div className="sim-checkbox-row">
                      <input
                        type="checkbox"
                        id="rag-cache"
                        checked={enableSemanticCache}
                        onChange={(e) =>
                          setEnableSemanticCache(e.target.checked)
                        }
                      />
                      <label htmlFor="rag-cache">
                        Redis Semantic Cache (&lt;15ms warm hit)
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="pill-button dark sim-trigger-btn"
                    onClick={runRagSimulation}
                    disabled={ragRunning}
                  >
                    {ragRunning ? (
                      <>
                        <Activity className="animate-spin" size={16} />{" "}
                        Executing Hybrid Query...
                      </>
                    ) : (
                      <>
                        <Play size={16} /> Run Intelligent Retrieval
                      </>
                    )}
                  </button>
                </div>

                {/* RAG Telemetry Output */}
                <div className="sim-output-card">
                  <div className="sim-card-header">
                    <span className="sim-card-tag">QUERY PERFORMANCE</span>
                    <h3>Inference Telemetry</h3>
                  </div>

                  {/* Step indicators */}
                  <div className="pipeline-visual-track">
                    <div
                      className={`track-node ${ragStep >= 1 ? "active" : ""}`}
                    >
                      <div className="track-dot">1</div>
                      <span>Embeddings</span>
                    </div>
                    <div
                      className={`track-connector ${ragStep >= 2 ? "active" : ""}`}
                    />
                    <div
                      className={`track-node ${ragStep >= 2 ? "active" : ""}`}
                    >
                      <div className="track-dot">2</div>
                      <span>pgvector RRF</span>
                    </div>
                    <div
                      className={`track-connector ${ragStep >= 3 ? "active" : ""}`}
                    />
                    <div
                      className={`track-node ${ragStep >= 3 ? "active" : ""}`}
                    >
                      <div className="track-dot">3</div>
                      <span>Guardrails</span>
                    </div>
                    <div
                      className={`track-connector ${ragStep >= 4 ? "active" : ""}`}
                    />
                    <div
                      className={`track-node ${ragStep >= 4 ? "active" : ""}`}
                    >
                      <div className="track-dot">4</div>
                      <span>Streamed Output</span>
                    </div>
                  </div>

                  {ragResult ? (
                    <div className="rag-result-pane">
                      <div className="rag-metrics-banner">
                        <div className="rag-metric">
                          <span className="rag-lbl">TOTAL LATENCY</span>
                          <strong className="rag-val">
                            {ragResult.latency}ms
                          </strong>
                        </div>
                        <div className="rag-metric">
                          <span className="rag-lbl">CACHE HIT</span>
                          <strong className="rag-val">
                            {ragResult.cacheHit ? "YES (38ms)" : "MISS"}
                          </strong>
                        </div>
                        <div className="rag-metric">
                          <span className="rag-lbl">PRECISION</span>
                          <strong className="rag-val text-emerald">
                            {ragResult.precision}%
                          </strong>
                        </div>
                        <div className="rag-metric">
                          <span className="rag-lbl">TOKEN INGEST</span>
                          <strong className="rag-val">
                            {ragResult.tokens} tokens
                          </strong>
                        </div>
                      </div>

                      <div className="rag-response-box">
                        <span className="rag-res-label">
                          SYNTHESIZED ANSWER (STRICT SCHEMA):
                        </span>
                        <p>{ragResult.response}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="sim-placeholder-pane">
                      <Cpu size={32} className="sim-placeholder-icon" />
                      <p>
                        Click &quot;Run Intelligent Retrieval&quot; to test the
                        hybrid search pipeline.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {(apiStep > 0 || ragResult) && (
            <section className="page-container">
              <ResultFollowup
                source="simulator"
                report={`VENIZOR illustrative pipeline report\nMode: ${mode}\nNetwork condition: ${networkCondition}\nCircuit breaker: ${enableCircuitBreaker ? "on" : "off"}\nSimulation stage: ${apiStep}\n${ragResult ? `Simulated latency: ${ragResult.latency}ms; illustrative precision: ${ragResult.precision}%; cache: ${ragResult.cacheHit ? "hit" : "miss"}` : ""}\n\nThese are simulated outputs, not live infrastructure or production benchmarks.`}
              />
            </section>
          )}
          {/* CTA Bottom Strip */}
          <section
            className="page-container about-action-strip"
            style={{ marginTop: 60 }}
          >
            <h2>
              Ready to implement these production pipelines for your platform?
            </h2>
            <p>
              Discuss API integrations, webhook recovery and retrieval workflows
              that fit your product and operating requirements.
            </p>
            <Link href="/contact" className="pill-button dark">
              Consult with our systems architects <ArrowUpRight size={18} />
            </Link>
          </section>
        </main>

        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
