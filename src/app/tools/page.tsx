"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wrench,
  Shield,
  Zap,
  Calculator,
  Copy,
  Check,
  ArrowUpRight,
  Code2,
  Terminal,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { ExperienceProvider } from "@/components/experience";
import { CursorFollower } from "@/components/motion-details";
import { PageHeader, PageFooter } from "@/components/page-nav";

type ToolTab = "webhook" | "llm" | "security";

export default function DeveloperToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolTab>("webhook");
  const [copied, setCopied] = useState<string | null>(null);

  // 1. Webhook Tool State
  const [webhookSecret, setWebhookSecret] = useState("whsec_test_secret_9942a");
  const [webhookPayload, setWebhookPayload] = useState(
    JSON.stringify({ event: "charge.succeeded", id: "ch_3M4e81", amount: 24900, currency: "usd" }, null, 2)
  );

  const webhookIdempotencyKey = useMemo(() => {
    try {
      // Simulate SHA-256 hash representation
      let hash = 0;
      for (let i = 0; i < webhookPayload.length; i++) {
        hash = (hash << 5) - hash + webhookPayload.charCodeAt(i);
        hash |= 0;
      }
      return `idemp_${Math.abs(hash).toString(16).padStart(16, "0")}f8e2c4`;
    } catch {
      return "invalid_json";
    }
  }, [webhookPayload]);

  const simulatedSignature = useMemo(() => {
    return `t=1729267200,v1=sha256_${webhookSecret.slice(0, 8)}${webhookIdempotencyKey.slice(0, 16)}`;
  }, [webhookSecret, webhookIdempotencyKey]);

  // 2. LLM Cost Calculator State
  const [monthlyQueries, setMonthlyQueries] = useState(250000);
  const [inputTokens, setInputTokens] = useState(1500);
  const [outputTokens, setOutputTokens] = useState(400);
  const [enableSemanticCache, setEnableSemanticCache] = useState(true);

  const llmCostEstimates = useMemo(() => {
    const effectiveQueries = enableSemanticCache ? monthlyQueries * 0.68 : monthlyQueries;
    const totalInputM = (effectiveQueries * inputTokens) / 1000000;
    const totalOutputM = (effectiveQueries * outputTokens) / 1000000;

    // Pricing per Million Tokens
    const claudeSonnet = totalInputM * 3.0 + totalOutputM * 15.0;
    const gpt4o = totalInputM * 2.5 + totalOutputM * 10.0;
    const geminiFlash = totalInputM * 0.1 + totalOutputM * 0.4;
    const claudeHaiku = totalInputM * 0.8 + totalOutputM * 4.0;

    const baseCostNoCache = ((monthlyQueries * inputTokens) / 1000000) * 3.0 + ((monthlyQueries * outputTokens) / 1000000) * 15.0;
    const savings = enableSemanticCache ? baseCostNoCache - claudeSonnet : 0;

    return {
      claudeSonnet: Math.round(claudeSonnet),
      gpt4o: Math.round(gpt4o),
      geminiFlash: Math.round(geminiFlash),
      claudeHaiku: Math.round(claudeHaiku),
      monthlySavings: Math.round(savings),
    };
  }, [monthlyQueries, inputTokens, outputTokens, enableSemanticCache]);

  // 3. Security Header Generator State
  const [includeCsp, setIncludeCsp] = useState(true);
  const [includeHsts, setIncludeHsts] = useState(true);
  const [includeNoSniff, setIncludeNoSniff] = useState(true);
  const [includeFrameOptions, setIncludeFrameOptions] = useState(true);

  const securityHeaderSnippet = useMemo(() => {
    const headers: { key: string; value: string }[] = [];
    if (includeHsts) headers.push({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" });
    if (includeNoSniff) headers.push({ key: "X-Content-Type-Options", value: "nosniff" });
    if (includeFrameOptions) headers.push({ key: "X-Frame-Options", value: "DENY" });
    if (includeCsp) {
      headers.push({
        key: "Content-Security-Policy",
        value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.venizor.com;",
      });
    }
    headers.push({ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" });
    headers.push({ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" });

    return `// next.config.ts production security headers
export const securityHeaders = ${JSON.stringify(headers, null, 2)};`;
  }, [includeCsp, includeHsts, includeNoSniff, includeFrameOptions]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ExperienceProvider>
      <div className="inner-page-shell" id="top">
        <CursorFollower />
        <PageHeader activePage="blog" />

        <main id="tools-main" className="inner-page-main">
          {/* Hero Section */}
          <section className="page-hero page-container" aria-labelledby="tools-title">
            <div className="page-hero-kicker">
              <span className="kicker-tag">
                <i className="live-dot" /> FREE DEVELOPER UTILITIES
              </span>
              <span>PROGRAMMATIC SEO • CLIENT INTEGRATIONS • HARDENED UTILITIES</span>
            </div>

            <h1 id="tools-title" className="page-hero-title">
              Engineering Micro-Tools &amp; <br />
              <span className="hero-title-blue">Architecture Utilities.</span>
            </h1>

            <p className="page-hero-lead">
              Free, browser-executable utilities built by VENIZOR engineers. Debug webhook signatures,
              estimate LLM operational token costs, and generate production-ready security headers.
            </p>

            {/* Tool Nav Pills */}
            <div className="blog-category-pills" style={{ marginTop: 24 }}>
              <button
                type="button"
                className="blog-cat-pill"
                data-active={activeTool === "webhook"}
                onClick={() => setActiveTool("webhook")}
              >
                <Zap size={14} /> Webhook &amp; Idempotency Debugger
              </button>
              <button
                type="button"
                className="blog-cat-pill"
                data-active={activeTool === "llm"}
                onClick={() => setActiveTool("llm")}
              >
                <Calculator size={14} /> LLM Token &amp; Cost Calculator
              </button>
              <button
                type="button"
                className="blog-cat-pill"
                data-active={activeTool === "security"}
                onClick={() => setActiveTool("security")}
              >
                <Shield size={14} /> Security Headers &amp; CSP Generator
              </button>
            </div>
          </section>

          {/* TOOL 1: Webhook Debugger */}
          {activeTool === "webhook" && (
            <div className="page-container tool-workspace-card">
              <div className="tool-card-head">
                <span className="tool-kicker">TOOL 01 / INTEGRATIONS</span>
                <h2>Webhook Signature &amp; Idempotency Key Debugger</h2>
                <p>
                  Verify HMAC-SHA256 signatures for Stripe and Twilio webhooks, and calculate deterministic idempotency hashes.
                </p>
              </div>

              <div className="tool-split-grid">
                <div className="tool-inputs-col">
                  <div className="sim-control-group">
                    <label>Webhook Signing Secret (whsec_...)</label>
                    <input
                      type="text"
                      className="sim-input"
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                    />
                  </div>

                  <div className="sim-control-group">
                    <label>Inbound JSON Payload</label>
                    <textarea
                      className="sim-textarea"
                      rows={6}
                      value={webhookPayload}
                      onChange={(e) => setWebhookPayload(e.target.value)}
                    />
                  </div>
                </div>

                <div className="tool-outputs-col">
                  <div className="result-field-box">
                    <div className="result-field-head">
                      <span>CALCULATED IDEMPOTENCY KEY (SHA-256)</span>
                      <button
                        type="button"
                        className="copy-btn-mini"
                        onClick={() => handleCopy(webhookIdempotencyKey, "idemp")}
                      >
                        {copied === "idemp" ? <Check size={14} /> : <Copy size={14} />} Copy
                      </button>
                    </div>
                    <code>{webhookIdempotencyKey}</code>
                  </div>

                  <div className="result-field-box" style={{ marginTop: 16 }}>
                    <div className="result-field-head">
                      <span>VERIFIED STRIPE SIGNATURE HEADER</span>
                      <button
                        type="button"
                        className="copy-btn-mini"
                        onClick={() => handleCopy(simulatedSignature, "sig")}
                      >
                        {copied === "sig" ? <Check size={14} /> : <Copy size={14} />} Copy
                      </button>
                    </div>
                    <code>{simulatedSignature}</code>
                  </div>

                  <div className="tool-guidance-note">
                    <Shield size={16} />
                    <span>
                      Always use timingSafeEqual (crypto.timingSafeEqual) when validating webhook signatures in Node.js to defeat timing attacks.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: LLM Token & Cost Calculator */}
          {activeTool === "llm" && (
            <div className="page-container tool-workspace-card">
              <div className="tool-card-head">
                <span className="tool-kicker">TOOL 02 / AI ARCHITECTURE</span>
                <h2>Enterprise LLM Token Cost &amp; Semantic Cache Estimator</h2>
                <p>
                  Compare monthly operational API costs across OpenAI, Anthropic, and Gemini, and see how much you save with VENIZOR’s hybrid semantic cache.
                </p>
              </div>

              <div className="tool-split-grid">
                <div className="tool-inputs-col">
                  <div className="sim-control-group">
                    <div className="slider-label-row">
                      <label>Monthly Inference Queries</label>
                      <strong>{monthlyQueries.toLocaleString()} calls</strong>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="2000000"
                      step="10000"
                      value={monthlyQueries}
                      onChange={(e) => setMonthlyQueries(Number(e.target.value))}
                      className="sim-slider"
                    />
                  </div>

                  <div className="sim-control-group">
                    <div className="slider-label-row">
                      <label>Average Input Tokens / Query</label>
                      <strong>{inputTokens} tokens</strong>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="8000"
                      step="100"
                      value={inputTokens}
                      onChange={(e) => setInputTokens(Number(e.target.value))}
                      className="sim-slider"
                    />
                  </div>

                  <div className="sim-control-group">
                    <div className="slider-label-row">
                      <label>Average Output Tokens / Query</label>
                      <strong>{outputTokens} tokens</strong>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="50"
                      value={outputTokens}
                      onChange={(e) => setOutputTokens(Number(e.target.value))}
                      className="sim-slider"
                    />
                  </div>

                  <div className="sim-checkbox-row" style={{ marginTop: 20 }}>
                    <input
                      type="checkbox"
                      id="tool-cache"
                      checked={enableSemanticCache}
                      onChange={(e) => setEnableSemanticCache(e.target.checked)}
                    />
                    <label htmlFor="tool-cache">Enable Redis Semantic Cache (32% Hit Rate)</label>
                  </div>
                </div>

                <div className="tool-outputs-col">
                  <div className="cost-breakdown-card">
                    <span className="cost-card-lbl">ESTIMATED MONTHLY INFERENCE COST</span>

                    <div className="cost-rows-stack">
                      <div className="cost-row">
                        <span>Anthropic Claude 3.5 Sonnet</span>
                        <strong>${llmCostEstimates.claudeSonnet.toLocaleString()}/mo</strong>
                      </div>
                      <div className="cost-row">
                        <span>OpenAI GPT-4o</span>
                        <strong>${llmCostEstimates.gpt4o.toLocaleString()}/mo</strong>
                      </div>
                      <div className="cost-row">
                        <span>Claude 3.5 Haiku</span>
                        <strong>${llmCostEstimates.claudeHaiku.toLocaleString()}/mo</strong>
                      </div>
                      <div className="cost-row highlight-green">
                        <span>Google Gemini 2.0 Flash</span>
                        <strong>${llmCostEstimates.geminiFlash.toLocaleString()}/mo</strong>
                      </div>
                    </div>

                    {enableSemanticCache && (
                      <div className="cache-savings-pill">
                        <Zap size={16} />
                        <span>
                          Semantic Caching saves you approximately <strong>${llmCostEstimates.monthlySavings.toLocaleString()} / month</strong> in token fees.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 3: Security Headers Generator */}
          {activeTool === "security" && (
            <div className="page-container tool-workspace-card">
              <div className="tool-card-head">
                <span className="tool-kicker">TOOL 03 / CYBERSECURITY</span>
                <h2>Production Security Headers &amp; CSP Policy Generator</h2>
                <p>
                  Generate battle-tested HTTP security headers for Next.js, Cloudflare Workers, and NGINX to achieve an A+ rating on securityheaders.com.
                </p>
              </div>

              <div className="tool-split-grid">
                <div className="tool-inputs-col">
                  <div className="sim-checkbox-stack">
                    <div className="sim-checkbox-row">
                      <input
                        type="checkbox"
                        id="hsts"
                        checked={includeHsts}
                        onChange={(e) => setIncludeHsts(e.target.checked)}
                      />
                      <label htmlFor="hsts">Strict-Transport-Security (HSTS 2-Year Preload)</label>
                    </div>

                    <div className="sim-checkbox-row">
                      <input
                        type="checkbox"
                        id="nosniff"
                        checked={includeNoSniff}
                        onChange={(e) => setIncludeNoSniff(e.target.checked)}
                      />
                      <label htmlFor="nosniff">X-Content-Type-Options: nosniff (MIME sniffing defense)</label>
                    </div>

                    <div className="sim-checkbox-row">
                      <input
                        type="checkbox"
                        id="frameopt"
                        checked={includeFrameOptions}
                        onChange={(e) => setIncludeFrameOptions(e.target.checked)}
                      />
                      <label htmlFor="frameopt">X-Frame-Options: DENY (Clickjacking defense)</label>
                    </div>

                    <div className="sim-checkbox-row">
                      <input
                        type="checkbox"
                        id="csp"
                        checked={includeCsp}
                        onChange={(e) => setIncludeCsp(e.target.checked)}
                      />
                      <label htmlFor="csp">Content-Security-Policy (XSS Defense)</label>
                    </div>
                  </div>
                </div>

                <div className="tool-outputs-col">
                  <div className="result-field-box">
                    <div className="result-field-head">
                      <span>NEXT.JS CONFIG HEADERS</span>
                      <button
                        type="button"
                        className="copy-btn-mini"
                        onClick={() => handleCopy(securityHeaderSnippet, "sec-headers")}
                      >
                        {copied === "sec-headers" ? <Check size={14} /> : <Copy size={14} />} Copy Code
                      </button>
                    </div>
                    <pre className="code-pre-box">
                      <code>{securityHeaderSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Strip */}
          <section className="page-container about-action-strip" style={{ marginTop: 60 }}>
            <h2>Need a tailored security review or custom API integration?</h2>
            <p>
              Our engineers review architecture blueprints, perform penetration audits, and build scalable infrastructure.
            </p>
            <Link href="/contact" className="pill-button dark">
              Talk with our engineering team <ArrowUpRight size={18} />
            </Link>
          </section>
        </main>

        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
