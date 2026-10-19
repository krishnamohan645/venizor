"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Calculator,
  Check,
  Copy,
  Fingerprint,
  ShieldCheck,
  Webhook,
} from "lucide-react";
import { ExperienceProvider } from "@/components/experience";
import { PageHeader, PageFooter } from "@/components/page-nav";
import {
  createSecurityHeaders,
  estimateTokens,
  signWebhook,
  type TokenInputs,
} from "@/lib/developer-tools";
import { SectionIllustration } from "@/components/section-illustration";

const tools = [
  {
    id: "webhook",
    label: "Webhook Signature & Idempotency",
    short: "Webhook lab",
    description: "Inspect a payload. Generate a signature.",
    icon: Webhook,
  },
  {
    id: "llm",
    label: "LLM Token & Cost Calculator",
    short: "Token budget",
    description: "Turn model usage into a monthly estimate.",
    icon: Calculator,
  },
  {
    id: "security",
    label: "Security Headers & CSP Generator",
    short: "Header builder",
    description: "Build a starting policy for your application.",
    icon: ShieldCheck,
  },
] as const;
const initialPayload = JSON.stringify(
  {
    event: "order.created",
    id: "order_example",
    amount: 24900,
    currency: "usd",
  },
  null,
  2,
);
const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export default function DeveloperToolsPage() {
  const [active, setActive] = useState<(typeof tools)[number]["id"]>("webhook");
  const [payload, setPayload] = useState(initialPayload);
  const [secret, setSecret] = useState("example_signing_secret");
  const [timestamp, setTimestamp] = useState("1729267200");
  const [signed, setSigned] = useState<Awaited<
    ReturnType<typeof signWebhook>
  > | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("");
  const [copyError, setCopyError] = useState("");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tokens, setTokens] = useState<TokenInputs>({
    queries: 250000,
    input: 1500,
    output: 400,
    inputRate: 2.5,
    outputRate: 10,
    cache: 0,
  });
  const [headers, setHeaders] = useState({
    hsts: true,
    noSniff: true,
    frames: true,
    csp: true,
  });
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );
  const estimate = estimateTokens(tokens);
  const code = `// Add these entries to your Next.js headers configuration.\nconst securityHeaders = ${JSON.stringify(createSecurityHeaders(headers), null, 2)};`;
  const selected = tools.find((tool) => tool.id === active)!;
  async function copy(value: string, id: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState(id);
      setCopyError("");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopyState(""), 2500);
    } catch {
      setCopyError(
        "Copy is unavailable. Select the output and copy it manually.",
      );
    }
  }
  function copyButton(value: string, id: string) {
    return (
      <button
        type="button"
        className="tool-copy"
        onClick={() => void copy(value, id)}
      >
        {copyState === id ? <Check size={15} /> : <Copy size={15} />}
        {copyState === id ? "Copied" : "Copy"}
      </button>
    );
  }
  async function generate() {
    setBusy(true);
    setError("");
    setSigned(null);
    try {
      setSigned(await signWebhook(payload, secret, timestamp));
    } catch (issue) {
      setError(
        issue instanceof SyntaxError
          ? "This payload is not valid JSON. Check its brackets, commas and quoted keys."
          : issue instanceof Error
            ? issue.message
            : "Unable to generate a signature. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  function updateToken(key: keyof TokenInputs, value: number) {
    const upper =
      key === "cache"
        ? 100
        : key === "inputRate" || key === "outputRate"
          ? 10000
          : 1e9;
    setTokens((previous) => ({
      ...previous,
      [key]: Math.max(0, Math.min(upper, Number.isFinite(value) ? value : 0)),
    }));
  }
  return (
    <ExperienceProvider>
      <div className="inner-page-shell tools-page" id="top">
        <a className="skip-link" href="#tools-main">
          Skip to content
        </a>
        <PageHeader />
        <main id="tools-main" className="inner-page-main">
          <section className="tools-opening page-container">
            <div>
              <span className="section-kicker">
                VENIZOR / THE DEVELOPER BENCH
              </span>
              <h1 className="page-hero-title">
                Small tools.
                <br />
                <span>Useful answers.</span>
              </h1>
              <p>
                A few things to make the next build easier. Inspect a webhook,
                plan a token budget, or put your headers in order.
              </p>
              <div className="tools-opening-notes">
                <span>
                  <Fingerprint size={15} /> Inputs stay in your browser
                </span>
                <span>Free to use · No account</span>
              </div>
            </div>
            <SectionIllustration kind="tools" className="tools-opening-art" />
          </section>
          <div className="tools-bench page-container">
            <nav
              className="tools-selector"
              aria-label="Choose a developer tool"
            >
              <p className="section-kicker">PICK UP A TOOL</p>
              {tools.map((tool, index) => (
                <button
                  key={tool.id}
                  type="button"
                  aria-pressed={active === tool.id}
                  onClick={() => {
                    setActive(tool.id);
                    setCopyError("");
                  }}
                  aria-controls="tool-panel"
                >
                  <span className="tool-selector-number">0{index + 1}</span>
                  <tool.icon size={21} strokeWidth={1.5} />
                  <span>
                    <strong>{tool.label}</strong>
                    <small>{tool.description}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              ))}
              <p className="tools-bench-note">
                Built for exploration.
                <br />
                Useful in your next conversation, too.
              </p>
            </nav>
            <section
              className="tool-panel"
              id="tool-panel"
              aria-labelledby="tool-title"
              key={active}
            >
              <header className="tool-panel-heading">
                <span className="section-kicker">{`0${tools.findIndex((tool) => tool.id === active) + 1} / ${selected.short.toUpperCase()}`}</span>
                <h2 id="tool-title">
                  {active === "webhook"
                    ? "Know what you’re sending."
                    : active === "llm"
                      ? "Give your AI a budget."
                      : "Start with the right headers."}
                </h2>
                <p>
                  {active === "webhook"
                    ? "Generate a SHA-256 payload digest and a Stripe-style HMAC signature from the exact payload bytes. This creates an example signature; it does not verify incoming requests."
                    : active === "llm"
                      ? "Enter your usage and provider rates. The starting rates are editable examples, rather than a live pricing feed."
                      : "Choose your headers and copy a configuration starting point. Review your CSP against your application’s scripts and asset domains before applying it."}
                </p>
              </header>
              {active === "webhook" && (
                <div className="tool-work-area">
                  <div className="tool-inputs">
                    <label htmlFor="webhook-payload">
                      JSON payload <span>Exact bytes are signed</span>
                    </label>
                    <textarea
                      id="webhook-payload"
                      rows={8}
                      spellCheck={false}
                      disabled={busy}
                      value={payload}
                      onChange={(event) => {
                        setPayload(event.target.value);
                        setSigned(null);
                      }}
                    />
                    <label htmlFor="webhook-secret">Signing secret</label>
                    <input
                      id="webhook-secret"
                      autoComplete="off"
                      spellCheck={false}
                      disabled={busy}
                      value={secret}
                      onChange={(event) => {
                        setSecret(event.target.value);
                        setSigned(null);
                      }}
                    />
                    <label htmlFor="webhook-time">
                      Unix timestamp <span>Seconds</span>
                    </label>
                    <input
                      id="webhook-time"
                      inputMode="numeric"
                      disabled={busy}
                      value={timestamp}
                      onChange={(event) => {
                        setTimestamp(event.target.value);
                        setSigned(null);
                      }}
                    />
                    <button
                      className="pill-button dark tool-run"
                      type="button"
                      disabled={busy}
                      onClick={() => void generate()}
                    >
                      {busy ? "Generating…" : "Generate signature"}
                      <ArrowRight size={17} />
                    </button>
                    {error && (
                      <p role="alert" className="tool-error">
                        {error}
                      </p>
                    )}
                  </div>
                  <div className="tool-result" aria-busy={busy}>
                    <div className="tool-result-top">
                      <span className="section-kicker">YOUR OUTPUT</span>
                      <span>
                        {signed ? "Ready to copy" : "Waiting for input"}
                      </span>
                    </div>
                    {signed ? (
                      <>
                        <div className="tool-output-field">
                          <div>
                            <label htmlFor="signature-output">
                              HMAC signature header
                            </label>
                            {copyButton(signed.signature, "signature")}
                          </div>
                          <textarea
                            id="signature-output"
                            readOnly
                            rows={5}
                            value={signed.signature}
                          />
                        </div>
                        <div className="tool-output-field">
                          <div>
                            <label htmlFor="digest-output">
                              Payload SHA-256 digest
                            </label>
                            {copyButton(signed.digest, "digest")}
                          </div>
                          <textarea
                            id="digest-output"
                            readOnly
                            rows={3}
                            value={signed.digest}
                          />
                        </div>
                        <p className="tool-result-caption">
                          HMAC-SHA256 of <code>timestamp.payload</code>. Your
                          secret and payload stay on this device.
                        </p>
                      </>
                    ) : (
                      <div className="tool-awaiting">
                        <Webhook size={44} strokeWidth={1} />
                        <h3>A clear view of the handshake.</h3>
                        <p>
                          Your generated signature and payload digest will
                          appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {active === "llm" && (
                <div className="tool-work-area">
                  <div className="tool-inputs">
                    <div className="tool-number-fields">
                      {(
                        [
                          {
                            key: "queries",
                            label: "Monthly requests",
                            suffix: "calls",
                          },
                          {
                            key: "input",
                            label: "Input tokens / request",
                            suffix: "tokens",
                          },
                          {
                            key: "output",
                            label: "Output tokens / request",
                            suffix: "tokens",
                          },
                          {
                            key: "inputRate",
                            label: "Input rate",
                            suffix: "USD / 1M tokens",
                          },
                          {
                            key: "outputRate",
                            label: "Output rate",
                            suffix: "USD / 1M tokens",
                          },
                        ] as const
                      ).map((field) => (
                        <div key={field.key}>
                          <label htmlFor={`token-${field.key}`}>
                            {field.label}
                          </label>
                          <div className="tool-number-input">
                            <input
                              id={`token-${field.key}`}
                              type="number"
                              min={0}
                              step={field.key.includes("Rate") ? "0.01" : "1"}
                              value={tokens[field.key]}
                              onChange={(event) =>
                                updateToken(
                                  field.key,
                                  event.target.valueAsNumber,
                                )
                              }
                            />
                            <span>{field.suffix}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="tool-cache">
                      <label htmlFor="token-cache">
                        Cache hit rate <strong>{tokens.cache}%</strong>
                      </label>
                      <input
                        id="token-cache"
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={tokens.cache}
                        onChange={(event) =>
                          updateToken("cache", Number(event.target.value))
                        }
                      />
                      <p>
                        A cache hit skips the entire model call in this
                        estimate.
                      </p>
                    </div>
                  </div>
                  <div className="tool-result token-result">
                    <span className="section-kicker">
                      ESTIMATED MONTHLY COST / USD
                    </span>
                    <output aria-live="polite" className="token-total">
                      {money(estimate.total)}
                    </output>
                    <p>Based on the rates and usage you entered.</p>
                    <dl>
                      <div>
                        <dt>Input tokens</dt>
                        <dd>{money(estimate.inputCost)}</dd>
                      </div>
                      <div>
                        <dt>Output tokens</dt>
                        <dd>{money(estimate.outputCost)}</dd>
                      </div>
                      <div>
                        <dt>Calls reaching the model</dt>
                        <dd>
                          {Math.round(estimate.calls).toLocaleString("en-US")}
                        </dd>
                      </div>
                      <div>
                        <dt>Estimated cache savings</dt>
                        <dd>{money(estimate.saved)}</dd>
                      </div>
                    </dl>
                    <div className="tool-cost-bar" aria-hidden="true">
                      <span
                        style={{
                          width: `${estimate.total ? (estimate.inputCost / estimate.total) * 100 : 0}%`,
                        }}
                      />
                      <i />
                    </div>
                    <div className="tool-cost-legend">
                      <span>Input cost</span>
                      <span>Output cost</span>
                    </div>
                    {copyButton(
                      `Monthly model cost: ${money(estimate.total)}\nInput: ${money(estimate.inputCost)}\nOutput: ${money(estimate.outputCost)}\nCache hit rate: ${tokens.cache}%\nEstimates use manually entered rates.`,
                      "budget",
                    )}
                  </div>
                </div>
              )}
              {active === "security" && (
                <div className="tool-work-area">
                  <div className="tool-inputs tool-header-options">
                    {(
                      [
                        {
                          key: "hsts",
                          title: "Require HTTPS",
                          detail:
                            "HSTS for one year. No automatic subdomain or preload opt-in.",
                        },
                        {
                          key: "noSniff",
                          title: "Keep content types explicit",
                          detail:
                            "Tell browsers to respect the declared MIME type.",
                        },
                        {
                          key: "frames",
                          title: "Prevent framing",
                          detail: "Set X-Frame-Options to DENY.",
                        },
                        {
                          key: "csp",
                          title: "Add a content policy",
                          detail:
                            "A restrictive same-origin CSP starting point.",
                        },
                      ] as const
                    ).map((option) => (
                      <label key={option.key} className="tool-header-option">
                        <input
                          type="checkbox"
                          checked={headers[option.key]}
                          onChange={(event) =>
                            setHeaders((previous) => ({
                              ...previous,
                              [option.key]: event.target.checked,
                            }))
                          }
                        />
                        <span>
                          <strong>{option.title}</strong>
                          <small>{option.detail}</small>
                        </span>
                      </label>
                    ))}
                    <p className="tool-result-caption">
                      Referrer-Policy and Permissions-Policy are included in
                      every configuration.
                    </p>
                  </div>
                  <div className="tool-result">
                    <div className="tool-result-top">
                      <span className="section-kicker">
                        NEXT.JS / CONFIGURATION
                      </span>
                      {copyButton(code, "headers")}
                    </div>
                    <pre
                      className="tool-code"
                      tabIndex={0}
                      aria-label="Generated security headers"
                    >
                      <code>{code}</code>
                    </pre>
                  </div>
                </div>
              )}
              <p role="status" aria-live="polite" className="tool-copy-status">
                {copyError || (copyState ? "Copied to clipboard." : "")}
              </p>
            </section>
          </div>
          <section className="tools-followup page-container">
            <div>
              <span className="section-kicker">
                FROM A QUICK CHECK TO A BETTER BUILD
              </span>
              <h2>Have a bigger question?</h2>
              <p>Let’s connect the tools to the system you’re building.</p>
            </div>
            <Link href="/contact" className="pill-button dark">
              Talk about your project <ArrowUpRight size={18} />
            </Link>
          </section>
        </main>
        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
