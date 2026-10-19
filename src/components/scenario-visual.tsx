"use client";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  FileText,
  MapPin,
  MoreHorizontal,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export type ScenarioKind = "payments" | "retrieval" | "operations" | "commerce";
const headings = {
  payments: [
    "FINTECH / A CLEARER PAYMENT JOURNEY",
    "Payment workspace",
    "payments.venizor.example",
  ],
  retrieval: [
    "KNOWLEDGE / ANSWERS WITH CONTEXT",
    "Knowledge workspace",
    "knowledge.venizor.example",
  ],
  operations: [
    "LOGISTICS / EVERY UPDATE IN VIEW",
    "Operations workspace",
    "operations.venizor.example",
  ],
  commerce: [
    "COMMERCE / FROM FIRST LOOK TO FINAL STEP",
    "Collection studio",
    "collection.venizor.example",
  ],
};
export function ScenarioVisual({
  kind,
  paused,
}: {
  kind: ScenarioKind;
  paused: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { margin: "60px" });
  const reduced = useReducedMotion();
  const [eyebrow, title, address] = headings[kind];
  return (
    <div
      ref={root}
      className={`studio-visual scenario-visual scenario-${kind}`}
      aria-hidden="true"
      data-scenario-playing={visible && !paused && !reduced}
    >
      <span className="scenario-visual-label">{eyebrow}</span>
      <div className="scenario-surface">
        <div className="scenario-browser">
          <div className="scenario-browser-bar">
            <span className="scenario-window-dots">
              <i />
              <i />
              <i />
            </span>
            <span>
              <ShieldCheck size={10} />
              {address}
            </span>
            <MoreHorizontal size={15} />
          </div>
          <div className="scenario-app-bar">
            <span className="scenario-app-brand">
              <i />
              {title}
            </span>
            {kind === "commerce" ? (
              <ShoppingBag size={17} />
            ) : (
              <span className="scenario-avatar">V</span>
            )}
          </div>
          {kind === "payments" && (
            <div className="scenario-app-body">
              <div className="scenario-panel-title">
                <div>
                  <span>PAYMENTS / OVERVIEW</span>
                  <h5>Every step, accounted for.</h5>
                </div>
                <MoreHorizontal size={16} />
              </div>
              <div className="scenario-payment-card">
                <span>EXAMPLE ORDER</span>
                <div>
                  <strong>#1042</strong>
                  <span className="scenario-state">
                    <Check size={12} />
                    Received
                  </span>
                </div>
                <p>A clear record from request to confirmation.</p>
              </div>
              <div className="scenario-steps">
                {["Request", "Reconcile", "Confirm"].map((label, i) => (
                  <span key={label}>
                    <i>{i < 2 ? <Check size={12} /> : "03"}</i>
                    {label}
                    {i < 2 && <b />}
                  </span>
                ))}
              </div>
              <div className="scenario-table-head">
                <span>RECENT EVENTS</span>
                <span>ORDER #1042</span>
              </div>
              {["Payment received", "Order matched", "Confirmation queued"].map(
                (label, i) => (
                  <div className="scenario-event" key={label}>
                    <span className="scenario-event-icon">
                      {i === 2 ? <ArrowRight size={12} /> : <Check size={12} />}
                    </span>
                    <span>{label}</span>
                    <small>{i === 2 ? "Queued" : "Complete"}</small>
                  </div>
                ),
              )}
            </div>
          )}
          {kind === "retrieval" && (
            <div className="scenario-app-body">
              <div className="scenario-panel-title">
                <div>
                  <span>YOUR TEAM’S KNOWLEDGE</span>
                  <h5>A useful answer starts here.</h5>
                </div>
                <Sparkles size={19} />
              </div>
              <div className="scenario-query">
                <Search size={15} />
                <span>Where can I find the returns process?</span>
                <span className="scenario-query-send">
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <div className="scenario-answer">
                <span>
                  <Sparkles size={13} />
                  ANSWER PREVIEW
                </span>
                <p>
                  Start with the returns policy, then follow the steps in the
                  support handbook.
                </p>
                <p className="scenario-answer-muted">
                  The source passages stay attached, so your team can check the
                  context.
                </p>
                <div>
                  <span>1</span>
                  <span>2</span>
                  <CheckCheck size={14} />
                </div>
              </div>
              <div className="scenario-sources">
                <span>SOURCE REFERENCES</span>
                {["Returns policy", "Support handbook"].map((label, i) => (
                  <div key={label}>
                    <FileText size={17} />
                    <span>
                      <strong>{label}</strong>
                      <small>Source {i + 1} · Example document</small>
                    </span>
                    <ArrowUpRight size={13} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {kind === "operations" && (
            <div className="scenario-app-body">
              <div className="scenario-panel-title">
                <div>
                  <span>DISPATCH / ROUTE VIEW</span>
                  <h5>Keep the journey in view.</h5>
                </div>
                <span className="scenario-map-filter">
                  Today
                  <ChevronDown size={11} />
                </span>
              </div>
              <div className="scenario-map">
                <svg viewBox="0 0 440 214" fill="none">
                  <rect width="440" height="214" fill="#f4f7fc" />
                  <path
                    d="M0 44h440M0 100h440M0 164h440M60 0v214M146 0v214M233 0v214M326 0v214M394 0v214"
                    stroke="#e2e9f3"
                    strokeWidth="13"
                  />
                  <path
                    d="M0 44h440M0 100h440M0 164h440M60 0v214M146 0v214M233 0v214M326 0v214M394 0v214"
                    stroke="white"
                    strokeWidth="9"
                  />
                  <path
                    d="M-5 190C89 120 146 214 234 140S339 74 445 14"
                    stroke="#dbe8ff"
                    strokeWidth="20"
                  />
                  <path
                    d="M60 164h86v-64h180V44h68"
                    stroke="var(--blue)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    className="scenario-route-motion"
                    d="M60 164h86v-64h180V44h68"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="3 18"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="60"
                    cy="164"
                    r="9"
                    fill="var(--blue)"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <circle
                    cx="394"
                    cy="44"
                    r="9"
                    fill="var(--blue)"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <g className="scenario-map-vehicle">
                    <rect
                      x="220"
                      y="86"
                      width="28"
                      height="28"
                      rx="9"
                      fill="var(--blue)"
                    />
                    <path d="m230 94 9 6-9 6Z" fill="white" />
                  </g>
                </svg>
                <span className="scenario-map-caption">
                  <MapPin size={11} />
                  Illustrative route
                </span>
              </div>
              <div className="scenario-route-detail">
                <span className="scenario-event-icon">
                  <Package size={16} />
                </span>
                <div>
                  <strong>Delivery #1042</strong>
                  <small>Pickup → In transit → Delivery</small>
                </div>
                <span className="scenario-state">In transit</span>
              </div>
              <div className="scenario-table-head">
                <span>EVENT TIMELINE</span>
                <span>EXAMPLE</span>
              </div>
              <div className="scenario-event">
                <span className="scenario-event-icon">
                  <Check size={12} />
                </span>
                <span>Pickup confirmed</span>
                <small>Recorded</small>
              </div>
            </div>
          )}
          {kind === "commerce" && (
            <div className="scenario-app-body scenario-storefront">
              <div className="scenario-store-navigation">
                <span>Objects for the everyday.</span>
                <span>
                  Collection <ArrowUpRight size={12} />
                </span>
              </div>
              <div className="scenario-product-grid">
                <div className="scenario-product-art">
                  <svg viewBox="0 0 230 250" fill="none">
                    <ellipse cx="119" cy="219" rx="76" ry="11" fill="#d6e0f3" />
                    <path
                      d="M59 86h112l16 123c-47 14-94 14-142 0Z"
                      fill="#3265ee"
                    />
                    <path
                      d="M59 86h112l-7 117c-33 9-68 9-101 0Z"
                      fill="#164df4"
                    />
                    <path
                      d="M82 110V62c0-40 66-40 66 0v48"
                      stroke="#83a3fa"
                      strokeWidth="12"
                    />
                    <path
                      d="M82 107V62c0-40 66-40 66 0v45"
                      stroke="#164df4"
                      strokeWidth="7"
                    />
                    <path
                      d="m70 122 4 74m83-74-4 74"
                      stroke="#3e70f4"
                      strokeWidth="2"
                    />
                    <rect
                      x="94"
                      y="144"
                      width="42"
                      height="32"
                      rx="2"
                      fill="#f3f6ff"
                    />
                    <path
                      d="m105 154 10 12 10-12"
                      stroke="#164df4"
                      strokeWidth="3"
                    />
                    <path
                      d="m45 209 18-6m124 6-23-6"
                      stroke="#6690fa"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>THE EVERYDAY COLLECTION</span>
                </div>
                <div className="scenario-product-copy">
                  <span>01 / EVERYDAY ESSENTIALS</span>
                  <h5>The everyday carry.</h5>
                  <p>
                    A little more room.
                    <br />A little less to think about.
                  </p>
                  <div className="scenario-swatches">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="scenario-add-to-bag">
                    Add to bag
                    <ShoppingBag size={14} />
                  </span>
                  <span className="scenario-product-note">
                    A storefront concept
                  </span>
                </div>
              </div>
              <div className="scenario-order-flow">
                <span>
                  <Search size={13} />
                  Discover
                </span>
                <i />
                <span>
                  <ShoppingBag size={13} />
                  Add to cart
                </span>
                <i />
                <span>
                  <Check size={13} />
                  Confirm
                </span>
              </div>
              <div className="scenario-order-confirmation">
                <span className="scenario-confirm-icon">
                  <CheckCheck size={17} />
                </span>
                <div>
                  <strong>Order received</strong>
                  <small>Inventory reserved · Confirmation queued</small>
                </div>
                <ArrowUpRight size={14} />
              </div>
            </div>
          )}
        </div>
        <div className="scenario-context-label">
          <span className="scenario-context-dot" />
          {kind === "commerce"
            ? "A connected order journey"
            : kind === "payments"
              ? "One request. A traceable outcome."
              : kind === "retrieval"
                ? "Sources stay within reach"
                : "From event to a shared picture"}
          <ArrowRight size={13} />
        </div>
      </div>
      <span className="scenario-visual-footnote">
        INTERFACE EXPLORATION / SAMPLE DATA
      </span>
    </div>
  );
}
