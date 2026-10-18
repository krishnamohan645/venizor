"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type FormEvent,
} from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";

import {
  ArrowRight,
  ArrowUpRight,
  Search,
  X,
  Check,
  LayoutDashboard,
  Wallet,
  Bell,
  GitBranch,
  Mail,
  CheckCheck,
} from "lucide-react";

type Detail = { title: string; description: string; features?: string[] };
type ModalState =
  | { type: "detail"; detail: Detail }
  | { type: "contact"; consultation?: boolean }
  | { type: "search" }
  | null;
const ExperienceContext = createContext<(state: ModalState) => void>(() => {});
export function useExperienceDialog() {
  return useContext(ExperienceContext);
}
const navigation = [
  ["Products", "products"],
  ["Services", "services"],
  ["Industries", "industries"],
  ["Our work", "work"],
  ["About studio", "about"],
  ["Who we are (page)", "/about"],
  ["Blog & field notes", "/blog"],
  ["Stack Playbook", "/playbook"],
  ["Pipeline Simulator", "/simulator"],
  ["Case Studies & Telemetry", "/case-studies"],
  ["Developer Tools", "/tools"],
  ["Project Scoping Wizard", "/scope"],
  ["Contact us (page)", "/contact"],
  ["Insights", "insights"],
];

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null);
  const [query, setQuery] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [draftLink, setDraftLink] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const isModalOpen = modal !== null;
  useEffect(() => {
    if (!isModalOpen) return;
    opener.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      opener.current?.focus();
    };
  }, [isModalOpen]);
  const close = () => {
    dialog.current?.close();
    setModal(null);
    setDraftReady(false);
    setQuery("");
  };
  const open = (state: ModalState) => {
    setDraftReady(false);
    setModal(state);
  };
  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `${modal?.type === "contact" && modal.consultation ? "Free consultation" : "Project enquiry"}: ${data.get("service")}`;
    const body = `Hello VENIZOR,\n\n${data.get("message")}\n\nInterested in: ${data.get("service")}\nName: ${data.get("name")}\nEmail: ${data.get("email")}`;
    setDraftLink(
      `mailto:info@venizor.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
    setDraftReady(true);
  }
  return (
    <MotionConfig reducedMotion="user">
      <ExperienceContext.Provider value={open}>
        {children}
        {modal && (
          <dialog
            ref={dialog}
            aria-labelledby="dialog-title"
            className={`site-dialog ${modal.type === "search" ? "search-dialog" : ""}`}
            onCancel={close}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                const rect = e.currentTarget.getBoundingClientRect();
                if (
                  e.clientX < rect.left ||
                  e.clientX > rect.right ||
                  e.clientY < rect.top ||
                  e.clientY > rect.bottom
                )
                  close();
              }
            }}
          >
            <button
              className="dialog-close icon-button"
              aria-label="Close dialog"
              onClick={close}
            >
              <X size={22} />
            </button>
            {modal.type === "detail" && (
              <>
                <p className="eyebrow">THE VENIZOR PERSPECTIVE</p>
                <h2 id="dialog-title">{modal.detail.title}</h2>
                <p className="dialog-description">{modal.detail.description}</p>
                {modal.detail.features && (
                  <ul className="detail-list">
                    {modal.detail.features.map((item) => (
                      <li key={item}>
                        <Check size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className="button primary"
                  onClick={() => open({ type: "contact" })}
                >
                  Let’s talk about your idea <ArrowUpRight size={17} />
                </button>
              </>
            )}
            {modal.type === "contact" && (
              <>
                <p className="eyebrow">GOOD THINGS START HERE</p>
                <h2 id="dialog-title">
                  {modal.consultation
                    ? "A conversation.\nA fresh perspective."
                    : "Tell us what\nyou’re thinking."}
                </h2>
                <p className="dialog-description">
                  A big ambition, a tricky challenge, or an idea on a napkin.
                  <br />
                  We’d love to hear it.
                </p>
                <form
                  onSubmit={prepareEmail}
                  onChange={() => setDraftReady(false)}
                >
                  <div className="form-row">
                    <label>
                      Your name
                      <input
                        name="name"
                        autoComplete="name"
                        placeholder="Alex Morgan"
                        required
                        maxLength={100}
                      />
                    </label>
                    <label>
                      Work email
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        spellCheck={false}
                        placeholder="alex@company.com"
                        required
                        maxLength={200}
                      />
                    </label>
                  </div>
                  <label>
                    I’m interested in
                    <select
                      name="service"
                      defaultValue={
                        modal.consultation
                          ? "A free consultation"
                          : "A new project"
                      }
                    >
                      <option>A new project</option>
                      <option>Website development</option>
                      <option>Web or mobile application</option>
                      <option>AI & automation</option>
                      <option>Digital growth</option>
                      <option>SaaS products & early access</option>
                      <option>A free consultation</option>
                    </select>
                  </label>
                  <label>
                    A little about your idea
                    <textarea
                      name="message"
                      rows={3}
                      required
                      maxLength={4000}
                      placeholder="What would you like to build or improve?"
                    />
                  </label>
                  {draftReady ? (
                    <div className="draft-ready" role="status">
                      <span>
                        <CheckCheck size={19} /> Your email draft is ready.
                      </span>
                      <a className="button primary" href={draftLink}>
                        Open in your email app <ArrowUpRight size={17} />
                      </a>
                      <small>
                        Review and send it from your email app. Nothing has been
                        sent yet.
                      </small>
                    </div>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="button primary form-submit"
                      >
                        Prepare your enquiry <ArrowUpRight size={17} />
                      </button>
                      <p className="form-note">
                        We’ll prepare an email for you to review and send to
                        info@venizor.com.
                      </p>
                    </>
                  )}
                </form>
              </>
            )}
            {modal.type === "search" && (
              <>
                <p className="eyebrow">FIND YOUR WAY</p>
                <h2 id="dialog-title">What’s on your mind?</h2>
                <label className="search-field">
                  <Search size={22} />
                  <input
                    aria-label="Search this site"
                    placeholder="Search services, products, work…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <div className="search-results">
                  {navigation
                    .filter(([name]) =>
                      name.toLowerCase().includes(query.toLowerCase()),
                    )
                    .map(([name, id]) => (
                      <a
                        key={id}
                        href={id.startsWith("/") ? id : `#${id}`}
                        onClick={close}
                      >
                        {name}
                        <ArrowUpRight size={18} />
                      </a>
                    ))}
                  {navigation.filter(([name]) =>
                    name.toLowerCase().includes(query.toLowerCase()),
                  ).length === 0 && (
                    <p>
                      No matching sections. Try “services” or{" "}
                      <button
                        className="text-link"
                        onClick={() => open({ type: "contact" })}
                      >
                        tell us what you need <ArrowRight size={16} />
                      </button>
                      .
                    </p>
                  )}
                </div>
              </>
            )}
          </dialog>
        )}
      </ExperienceContext.Provider>
    </MotionConfig>
  );
}

export function ContactButton({
  children,
  className = "",
  consultation = false,
}: {
  children: ReactNode;
  className?: string;
  consultation?: boolean;
}) {
  const open = useContext(ExperienceContext);
  return (
    <button
      className={className}
      onClick={() => open({ type: "contact", consultation })}
    >
      {children}
    </button>
  );
}
export function DetailButton({
  children,
  className = "",
  title,
  description,
  features,
}: Detail & { children: ReactNode; className?: string }) {
  const open = useContext(ExperienceContext);
  return (
    <button
      className={className}
      onClick={() =>
        open({ type: "detail", detail: { title, description, features } })
      }
    >
      {children}
    </button>
  );
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px" }}
      onViewportEnter={(e) => {
        if (!reduced && e?.target)
          e.target.animate(
            [
              { transform: "translateY(22px)", opacity: 0.7 },
              { transform: "translateY(0px)", opacity: 1 },
            ],
            {
              duration: 700,
              delay: delay * 1000,
              easing: "cubic-bezier(.16,1,.3,1)",
              fill: "backwards",
            },
          );
      }}
    >
      {children}
    </motion.div>
  );
}

export function ProjectPreview({
  type,
}: {
  type: "website" | "dashboard" | "mobile" | "automation";
}) {
  return (
    <div className={`project-preview preview-${type}`} aria-hidden="true">
      {type === "website" && (
        <div className="browser-mock">
          <div className="browser-bar">
            <i />
            <i />
            <i />
            <span>formandfield.studio</span>
          </div>
          <div className="architecture-site">
            <div className="arch-nav">
              <b>form & field</b>
              <span>Spaces · Studio · Contact</span>
            </div>
            <div className="arch-copy">
              Spaces for
              <br />a slower life.
              <small>THOUGHTFULLY DESIGNED. NATURALLY LIVED.</small>
            </div>
            <div className="architecture-scene">
              <div className="arch-building">
                <i />
                <i />
                <i />
              </div>
              <div className="arch-sun" />
              <div className="arch-tree" />
            </div>
            <span className="arch-bottom">
              Architecture with a human perspective. ↗
            </span>
          </div>
        </div>
      )}
      {type === "dashboard" && (
        <div className="dashboard-mock">
          <aside>
            <span className="mini-brand">n.</span>
            <LayoutDashboard />
            <ChartIcon />
            <Wallet />
            <Bell />
          </aside>
          <div className="dashboard-content">
            <div className="dash-top">
              Overview <span>↗</span>
            </div>
            <small>Welcome back, Alex</small>
            <div className="mini-stats">
              <div>
                Total revenue<b>₹124,850</b>
                <em>↗ 12.8%</em>
              </div>
              <div>
                Active projects<b>24</b>
                <em>↗ 8.2%</em>
              </div>
            </div>
            <div className="chart-label">
              Revenue overview <span>This month⌄</span>
            </div>
            <div className="bar-chart">
              {[28, 44, 37, 62, 50, 79, 61, 72, 93, 76, 90, 100].map(
                (height, i) => (
                  <i key={i} style={{ height: `${height}%` }} />
                ),
              )}
            </div>
            <div className="dash-table">
              <span>Recent activity</span>
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      )}
      {type === "mobile" && (
        <>
          <div className="mobile-orbit" />
          <div className="phone-mock">
            <div className="phone-island" />
            <div className="phone-top">
              <span>9:41</span>
              <span>••• ▰</span>
            </div>
            <div className="phone-greeting">
              Good morning, Alex <span>☀</span>
            </div>
            <div className="balance-label">Your total balance</div>
            <div className="phone-balance">
              ₹48,250<span>.00</span>
            </div>
            <div className="payment-card">
              <span>venizor</span>
              <div>•••• &nbsp; •••• &nbsp; 4821</div>
              <small>
                ALEX MORGAN <b>VISA</b>
              </small>
            </div>
            <div className="phone-quick">
              <span>
                ↗<small>Send</small>
              </span>
              <span>
                ＋<small>Add</small>
              </span>
              <span>
                ⇄<small>Exchange</small>
              </span>
            </div>
            <div className="transactions">
              <b>Recent activity</b>
              <div>
                <span className="transaction-icon">↗</span>
                <span>
                  Studio subscription<small>Today, 10:24 AM</small>
                </span>
                <strong>−₹499</strong>
              </div>
              <div>
                <span className="transaction-icon">↓</span>
                <span>
                  Payment received<small>Yesterday</small>
                </span>
                <strong>+₹8,500</strong>
              </div>
            </div>
          </div>
        </>
      )}
      {type === "automation" && (
        <div className="workflow-mock">
          <div className="workflow-top">
            <span className="workflow-dot" /> Lead qualification{" "}
            <span>● Active</span>
          </div>
          <div className="flow-node node-start">
            <Mail size={16} />
            <span>
              New enquiry<small>Form received</small>
            </span>
            <Check size={10} />
          </div>
          <div className="flow-connector one" />
          <div className="flow-node node-ai">
            <SparkIcon />
            <span>
              AI qualification<small>Understand & categorize</small>
            </span>
            <Check size={10} />
          </div>
          <div className="flow-connector two" />
          <div className="flow-connector three" />
          <div className="flow-node node-left">
            <GitBranch size={14} />
            <span>
              Team review<small>Human in the loop</small>
            </span>
          </div>
          <div className="flow-node node-right">
            <Check size={15} />
            <span>
              CRM updated<small>Ready for follow-up</small>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 19V9h4v10m4 0V4h4v15m4 0v-6" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7Z" />
    </svg>
  );
}
