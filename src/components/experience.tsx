"use client";

import { motion, MotionConfig, useReducedMotion } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LeadForm } from "./lead-form";
import { SiteSearch } from "./site-search";
import { StudioVisual, type SceneKind } from "./studio-visual";

import { ArrowUpRight, Check, X } from "lucide-react";

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
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const isModalOpen = modal !== null;
  useEffect(() => {
    if (!isModalOpen) return;
    opener.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    dialog.current
      ?.querySelector<HTMLElement>("[data-dialog-autofocus]")
      ?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [isModalOpen]);
  const close = () => {
    dialog.current?.close();
    setModal(null);
  };
  const open = (state: ModalState) => {
    setModal(state);
  };
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
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                close();
              }
            }}
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
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href="/playbook"
                    className="button secondary"
                    onClick={close}
                    style={{ textDecoration: "none", fontSize: "13px" }}
                  >
                    Stack Playbook <ArrowUpRight size={14} />
                  </a>
                  <a
                    href="/scope"
                    className="button secondary"
                    onClick={close}
                    style={{ textDecoration: "none", fontSize: "13px" }}
                  >
                    Scoping Wizard <ArrowUpRight size={14} />
                  </a>
                </div>
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
                <LeadForm source="dialog" compact />
              </>
            )}
            {modal.type === "search" && (
              <SiteSearch
                onNavigate={() => {
                  opener.current = null;
                  close();
                }}
              />
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
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  consultation?: boolean;
  ariaLabel?: string;
}) {
  const open = useContext(ExperienceContext);
  return (
    <button
      className={className}
      aria-label={ariaLabel}
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
  const animation = useRef<Animation | null>(null);
  useEffect(() => () => animation.current?.cancel(), []);
  useEffect(() => {
    if (reduced) animation.current?.cancel();
  }, [reduced]);
  return (
    <motion.div
      className={className}
      initial={false}
      viewport={{ once: true, margin: "0px 0px -30px 0px" }}
      onViewportEnter={(e) => {
        if (!reduced && e?.target) {
          animation.current?.cancel();
          animation.current = e.target.animate(
            [
              { transform: "translateY(16px)", opacity: 0.75 },
              { transform: "translateY(0px)", opacity: 1 },
            ],
            {
              duration: 480,
              delay: Math.min(delay, 0.18) * 1000,
              easing: "cubic-bezier(.16,1,.3,1)",
              fill: "backwards",
            },
          );
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function ProjectPreview({
  type,
  paused = false,
}: {
  type: "website" | "dashboard" | "mobile" | "automation";
  paused?: boolean;
}) {
  const kinds: Record<string, SceneKind> = {
    website: "architecture",
    dashboard: "operations",
    mobile: "payments",
    automation: "retrieval",
  };
  return (
    <div className={`project-preview preview-${type}`} aria-hidden="true">
      <StudioVisual kind={kinds[type]} paused={paused} />
    </div>
  );
}
