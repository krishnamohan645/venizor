"use client";

import { ExperienceProvider } from "@/components/experience";
import { PageFooter, PageHeader } from "@/components/page-nav";
import { ResultFollowup } from "@/components/result-followup";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { useMemo, useState } from "react";

interface ObjectiveOption {
  id: string;
  title: string;
  desc: string;
  badge: string;
}

const objectives: ObjectiveOption[] = [
  {
    id: "greenfield",
    title: "New Greenfield Web / SaaS Platform",
    desc: "Complete product design, modern frontend architecture, and resilient API backend built from scratch.",
    badge: "Full Cycle",
  },
  {
    id: "scale_modernize",
    title: "Scaling & Modernizing Existing Systems",
    desc: "Migrate legacy code, optimize database queries, implement connection pooling, and decouple monoliths.",
    badge: "High Impact",
  },
  {
    id: "ai_rag",
    title: "Applied AI & Hybrid RAG Pipelines",
    desc: "Integrate vector embeddings, semantic caching, deterministic guardrails, and model fallbacks.",
    badge: "Applied AI",
  },
  {
    id: "api_integrations",
    title: "Custom APIs & Third-Party Integrations",
    desc: "Connect Stripe billing, Twilio voice/SMS, CRM webhooks, and external HTTPS services with zero data loss.",
    badge: "Distributed Systems",
  },
  {
    id: "security_audit",
    title: "Cybersecurity Audit & System Hardening",
    desc: "Defend against OWASP Top 10 vulnerabilities, enforce zero-trust APIs, and implement strict CSP and HMAC auth.",
    badge: "Hardening",
  },
];

const capabilityOptions = [
  "Custom REST / GraphQL APIs",
  "Third-Party HTTPS Webhooks (Stripe / Twilio)",
  "PostgreSQL + pgvector Database Architecture",
  "Docker & Automated Zero-Downtime CI/CD",
  "Enterprise LLM & Hybrid Vector Search (RAG)",
  "Real-Time WebSockets & Streaming Telemetry",
  "Zero-Trust Security & OWASP Hardening",
  "Technical SEO, AEO, GEO & Search Experience (SXO)",
];

export default function ProjectScopingWizardPage() {
  const [step, setStep] = useState(1);

  // Form State
  const [selectedObjective, setSelectedObjective] = useState("greenfield");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([
    "Custom REST / GraphQL APIs",
    "PostgreSQL + pgvector Database Architecture",
  ]);
  const [scaleTier, setScaleTier] = useState<
    "launch" | "growth" | "enterprise"
  >("growth");
  const [slaRequirement, setSlaRequirement] = useState<
    "standard" | "mission_critical"
  >("mission_critical");
  const [timeline, setTimeline] = useState("1 - 2 Months");
  const engagementModel = "Dedicated Sprint Squad";

  const toggleCapability = (cap: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap],
    );
  };

  const complexityProfile = useMemo(() => {
    let score = selectedCapabilities.length * 15;
    if (scaleTier === "enterprise") score += 30;
    if (slaRequirement === "mission_critical") score += 20;

    let level = "Standard Full-Stack";
    let sprints = "2 - 4 Production Sprints";
    if (score > 80) {
      level = "Enterprise Distributed Architecture";
      sprints = "4 - 8 Production Sprints";
    } else if (score > 50) {
      level = "High-Concurrency Scalable System";
      sprints = "3 - 5 Production Sprints";
    }

    return { score, level, sprints };
  }, [selectedCapabilities, scaleTier, slaRequirement]);

  const scopeReport = `VENIZOR indicative project scope
Objective: ${selectedObjective}
Architecture: ${complexityProfile.level}
Indicative sprints: ${complexityProfile.sprints}
Scale: ${scaleTier}
Reliability needs: ${slaRequirement}
Desired timeline: ${timeline}
Engagement: ${engagementModel}
Capabilities:
${selectedCapabilities.join("\n")}

An indicative planning aid. Final scope, cost and timing require discovery.`;

  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">

        <PageHeader activePage="contact" />

        <main id="scope-main" className="inner-page-main">
          {/* Hero Section */}
          <section
            className="page-hero page-container"
            aria-labelledby="scope-title"
          >
            <div className="page-hero-kicker">
              <span className="kicker-tag">
                <i className="live-dot" /> INTERACTIVE SCOPING WIZARD
              </span>
              <span>RAPID ESTIMATION • SYSTEM BLUEPRINTS • DIRECT INTAKE</span>
            </div>

            <h1 id="scope-title" className="page-hero-title">
              Project Architecture <br />
              <span className="hero-title-blue">Scoping Intake Wizard.</span>
            </h1>

            <p className="page-hero-lead">
              Answer 4 quick technical questions to generate a tailored
              architectural scope, complexity rating, and delivery sprint
              timeline.
            </p>

            {/* Step Progress Tracker */}
            <div className="wizard-progress-track">
              {[
                { num: 1, label: "Objective" },
                { num: 2, label: "Capabilities" },
                { num: 3, label: "Scale & SLA" },
                { num: 4, label: "Brief & Submit" },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`wizard-step-pill ${step === s.num ? "is-current" : step > s.num ? "is-complete" : ""}`}
                  onClick={() => step > s.num && setStep(s.num)}
                >
                  <span className="step-badge">
                    {step > s.num ? "✓" : `0${s.num}`}
                  </span>
                  <span className="step-name">{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* WIZARD CONTAINER */}
          <div className="page-container wizard-body-container">
            {/* STEP 1: Objective */}
            {step === 1 && (
              <div className="wizard-step-pane">
                <div className="step-pane-header">
                  <span className="step-kicker">STEP 01 OF 04</span>
                  <h2>What is the primary objective of your project?</h2>
                  <p>
                    Choose the core focus that best matches your immediate
                    business and technical goals.
                  </p>
                </div>

                <div className="objectives-selector-stack">
                  {objectives.map((obj) => (
                    <button
                      key={obj.id}
                      type="button"
                      className={`objective-card-btn ${selectedObjective === obj.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedObjective(obj.id)}
                    >
                      <div className="obj-card-top">
                        <span className="obj-title">{obj.title}</span>
                        <span className="obj-badge">{obj.badge}</span>
                      </div>
                      <p className="obj-desc">{obj.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="wizard-step-actions">
                  <div />
                  <button
                    type="button"
                    className="pill-button dark"
                    onClick={() => setStep(2)}
                  >
                    Continue to Capabilities <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Capabilities */}
            {step === 2 && (
              <div className="wizard-step-pane">
                <div className="step-pane-header">
                  <span className="step-kicker">STEP 02 OF 04</span>
                  <h2>
                    Which engineering disciplines will this system require?
                  </h2>
                  <p>
                    Select all technical areas you would like VENIZOR to design,
                    build, or harden.
                  </p>
                </div>

                <div className="capabilities-multi-grid">
                  {capabilityOptions.map((cap) => {
                    const isChecked = selectedCapabilities.includes(cap);
                    return (
                      <button
                        key={cap}
                        type="button"
                        className={`capability-pill-btn ${isChecked ? "is-checked" : ""}`}
                        onClick={() => toggleCapability(cap)}
                      >
                        <span className="cap-checkbox">
                          {isChecked && <Check size={14} />}
                        </span>
                        <span className="cap-text">{cap}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="wizard-step-actions">
                  <button
                    type="button"
                    className="pill-button light"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    className="pill-button dark"
                    onClick={() => setStep(3)}
                    disabled={selectedCapabilities.length === 0}
                  >
                    Continue to Scale &amp; SLA <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Scale & SLA */}
            {step === 3 && (
              <div className="wizard-step-pane">
                <div className="step-pane-header">
                  <span className="step-kicker">STEP 03 OF 04</span>
                  <h2>
                    What scale, availability, and delivery timeline do you
                    anticipate?
                  </h2>
                  <p>
                    This allows us to tailor the connection pooling,
                    infrastructure tier, and team allocation.
                  </p>
                </div>

                <div className="scale-selectors-stack">
                  <div className="sim-control-group">
                    <label>Anticipated Traffic &amp; User Concurrency</label>
                    <div className="sim-radio-stack">
                      <button
                        type="button"
                        className={`sim-toggle-pill ${scaleTier === "launch" ? "is-selected" : ""}`}
                        onClick={() => setScaleTier("launch")}
                      >
                        Launch Stage (&lt; 10,000 monthly active users)
                      </button>
                      <button
                        type="button"
                        className={`sim-toggle-pill ${scaleTier === "growth" ? "is-selected" : ""}`}
                        onClick={() => setScaleTier("growth")}
                      >
                        Growth Stage (10,000 to 100,000 active users)
                      </button>
                      <button
                        type="button"
                        className={`sim-toggle-pill ${scaleTier === "enterprise" ? "is-selected" : ""}`}
                        onClick={() => setScaleTier("enterprise")}
                      >
                        High-Load Enterprise (100,000 to 1M+ active users / high
                        RPS)
                      </button>
                    </div>
                  </div>

                  <div className="sim-control-group" style={{ marginTop: 24 }}>
                    <label>Availability &amp; Uptime SLA</label>
                    <div className="sim-radio-stack">
                      <button
                        type="button"
                        className={`sim-toggle-pill ${slaRequirement === "standard" ? "is-selected" : ""}`}
                        onClick={() => setSlaRequirement("standard")}
                      >
                        Standard Production (99.9% Uptime)
                      </button>
                      <button
                        type="button"
                        className={`sim-toggle-pill ${slaRequirement === "mission_critical" ? "is-selected" : ""}`}
                        onClick={() => setSlaRequirement("mission_critical")}
                      >
                        Mission-Critical FinTech / Health (99.999% Zero-Downtime
                        Blue/Green)
                      </button>
                    </div>
                  </div>

                  <div className="sim-control-group" style={{ marginTop: 24 }}>
                    <label>Target Delivery Window</label>
                    <div className="timeline-chips-row">
                      {[
                        "Immediate (< 2 Weeks)",
                        "1 - 2 Months",
                        "Quarterly Roadmap",
                      ].map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`timeline-chip ${timeline === t ? "is-active" : ""}`}
                          onClick={() => setTimeline(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="wizard-step-actions">
                  <button
                    type="button"
                    className="pill-button light"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    className="pill-button dark"
                    onClick={() => setStep(4)}
                  >
                    Review Scoping Brief <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Intake */}
            {step === 4 && (
              <div className="wizard-step-pane">
                <div className="step-pane-header">
                  <span className="step-kicker">STEP 04 OF 04 / FINAL</span>
                  <h2>Your indicative project outline</h2>
                  <p>
                    Review your planning outline below. You can download it
                    without sharing contact details.
                  </p>
                </div>

                {/* Live Architecture Summary Card */}
                <div className="scope-summary-card">
                  <div className="scope-card-top">
                    <div>
                      <span className="scope-kicker">SYSTEM PROFILE</span>
                      <h3 className="scope-level-title">
                        {complexityProfile.level}
                      </h3>
                    </div>
                    <div className="scope-sprint-chip">
                      <Clock size={16} />
                      <span>{complexityProfile.sprints}</span>
                    </div>
                  </div>

                  <div className="scope-capabilities-summary">
                    <span className="summary-lbl">
                      SELECTED CAPABILITIES ({selectedCapabilities.length}):
                    </span>
                    <div className="summary-tags-wrap">
                      {selectedCapabilities.map((cap) => (
                        <span key={cap} className="summary-tag">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <ResultFollowup report={scopeReport} source="scope" />
              </div>
            )}
          </div>
        </main>

        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
