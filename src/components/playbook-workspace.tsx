"use client";

import { ExperienceProvider, Reveal } from "@/components/experience";
import { CursorFollower } from "@/components/motion-details";
import { PageFooter, PageHeader } from "@/components/page-nav";
import {
  architectureBrief,
  optionFor,
  presets,
  reviewStack,
  stackLayers,
  stackOptions,
  type CoreLayer,
  type StackSelection,
} from "@/data/playbook";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  Copy,
  Database,
  Layers3,
  Monitor,
  Network,
  RotateCcw,
  Server,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";

const icons = {
  frontend: Monitor,
  backend: Server,
  database: Database,
  ai: Sparkles,
  devops: Layers3,
  integrations: Network,
};

export function PlaybookWorkspace() {
  const [selection, setSelection] = useState<StackSelection>(
    presets[0].selection,
  );
  const [active, setActive] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const layer = stackLayers[active];
  const Icon = icons[layer.id];
  const notes = reviewStack(selection);
  const spec = architectureBrief(selection);
  const preset = presets.find(
    (item) =>
      Object.entries(item.selection.core).every(
        ([key, value]) => selection.core[key as CoreLayer] === value,
      ) &&
      item.selection.integrations.length === selection.integrations.length &&
      item.selection.integrations.every((id) =>
        selection.integrations.includes(id),
      ),
  );
  const transition = { duration: reduced ? 0 : 0.24 };
  function choose(id: string) {
    setSelection((previous) =>
      layer.id === "integrations"
        ? {
            ...previous,
            integrations: previous.integrations.includes(id)
              ? previous.integrations.filter((item) => item !== id)
              : [...previous.integrations, id],
          }
        : { ...previous, core: { ...previous.core, [layer.id]: id } },
    );
    setCopyState("idle");
  }
  function applyPreset(index: number) {
    setSelection(presets[index].selection);
    setCopyState("idle");
  }
  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % stackLayers.length;
    else if (event.key === "ArrowLeft")
      next = (index + stackLayers.length - 1) % stackLayers.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stackLayers.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(spec);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }
  return (
    <ExperienceProvider>
      <div className="inner-page-shell pb-page" id="top">
        <a className="skip-link" href="#playbook-main">
          Skip to content
        </a>
        <CursorFollower />
        <PageHeader activePage="playbook" />
        <main id="playbook-main" className="inner-page-main">
          <section
            className="pb-hero page-container"
            aria-labelledby="playbook-title"
          >
            <Reveal>
              <div className="pb-eyebrow-line">
                <span>VENIZOR / THE STACK PLAYBOOK</span>
                <span>A LITTLE STRUCTURE. A LOT OF POSSIBILITY.</span>
              </div>
            </Reveal>
            <div className="pb-hero-grid">
              <Reveal>
                <h1 id="playbook-title">
                  Good systems.
                  <br />
                  <span>Start here.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1} className="pb-hero-note">
                <span className="pb-tiny-label">
                  FROM THE IDEA TO THE ARCHITECTURE
                </span>
                <p>
                  Every product is a set of connected decisions. Explore yours,
                  one layer at a time.
                </p>
                <a href="#stack-workspace" className="text-link">
                  Shape your stack <ArrowDown size={18} />
                </a>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <div className="pb-starters">
                <div className="pb-starter-intro">
                  <span className="pb-tiny-label">A STARTING POINT</span>
                  <p>
                    Pick a direction.
                    <br />
                    Make it your own.
                  </p>
                </div>
                <div className="pb-preset-list">
                  {presets.map((item, index) => (
                    <button
                      type="button"
                      key={item.id}
                      className={`pb-preset ${preset?.id === item.id ? "is-active" : ""}`}
                      aria-pressed={preset?.id === item.id}
                      onClick={() => applyPreset(index)}
                    >
                      <span className="pb-preset-number">0{index + 1}</span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.description}</small>
                      </span>
                      <span className="pb-preset-indicator">
                        {preset?.id === item.id ? (
                          <Check size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>
          <section
            className="pb-workspace page-container"
            id="stack-workspace"
            aria-labelledby="workspace-title"
          >
            <div className="pb-workspace-top">
              <div>
                <span className="pb-tiny-label">THE WORKING SESSION</span>
                <h2 id="workspace-title">Build a clearer picture.</h2>
              </div>
              <button
                type="button"
                className="pb-reset"
                onClick={() => {
                  applyPreset(0);
                  setActive(0);
                }}
              >
                <RotateCcw size={14} /> Reset stack
              </button>
            </div>
            <div
              className="pb-step-tabs"
              role="tablist"
              aria-label="Architecture layers"
            >
              {stackLayers.map((item, index) => (
                <button
                  key={item.id}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`pb-tab-${item.id}`}
                  aria-controls={`pb-panel-${item.id}`}
                  aria-selected={active === index}
                  tabIndex={active === index ? 0 : -1}
                  className={active === index ? "is-active" : ""}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => moveTab(event, index)}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                  {active === index && (
                    <motion.i
                      layoutId="pb-active-step"
                      transition={transition}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="pb-builder-grid">
              <div
                className="pb-choice-panel"
                role="tabpanel"
                id={`pb-panel-${layer.id}`}
                aria-labelledby={`pb-tab-${layer.id}`}
                tabIndex={0}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : -6 }}
                    transition={transition}
                  >
                    <div className="pb-layer-top">
                      <span className="pb-layer-icon">
                        <Icon size={23} strokeWidth={1.5} />
                      </span>
                      <span className="pb-tiny-label">
                        LAYER 0{active + 1} / 06
                      </span>
                    </div>
                    <h3>{layer.heading}</h3>
                    <p className="pb-layer-description">{layer.description}</p>
                    <fieldset className="pb-options">
                      <legend className="sr-only">
                        Choose {layer.label.toLowerCase()}
                        {layer.id === "integrations" ? " (select any)" : ""}
                      </legend>
                      {stackOptions[layer.id].map((option) => {
                        const checked =
                          layer.id === "integrations"
                            ? selection.integrations.includes(option.id)
                            : selection.core[layer.id] === option.id;
                        return (
                          <label
                            className={`pb-option ${checked ? "is-selected" : ""}`}
                            key={option.id}
                          >
                            <input
                              type={
                                layer.id === "integrations"
                                  ? "checkbox"
                                  : "radio"
                              }
                              name={`pb-${layer.id}`}
                              value={option.id}
                              checked={checked}
                              onChange={() => choose(option.id)}
                            />
                            <span className="pb-option-mark" aria-hidden="true">
                              {checked && <Check size={13} strokeWidth={2.5} />}
                            </span>
                            <span className="pb-option-copy">
                              <span className="pb-option-title">
                                {option.name}
                              </span>
                              <span className="pb-option-description">
                                {option.description}
                              </span>
                              <span className="pb-option-tag">
                                {option.tag}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </fieldset>
                    <p className="pb-layer-hint">
                      <span aria-hidden="true">↳</span>
                      {layer.hint}
                    </p>
                  </motion.div>
                </AnimatePresence>
                <div className="pb-step-actions">
                  <button
                    type="button"
                    disabled={active === 0}
                    onClick={() => setActive((value) => value - 1)}
                  >
                    <ArrowLeft size={16} /> Previous
                  </button>
                  {active < 5 ? (
                    <button
                      type="button"
                      onClick={() => setActive((value) => value + 1)}
                    >
                      Next layer <ArrowRight size={16} />
                    </button>
                  ) : (
                    <a href="#stack-review">
                      Review your stack <ArrowDown size={16} />
                    </a>
                  )}
                </div>
              </div>
              <aside className="pb-blueprint" aria-labelledby="blueprint-title">
                <div className="pb-blueprint-head">
                  <span className="pb-tiny-label">YOUR WORKING BLUEPRINT</span>
                  <span className="pb-blueprint-dot" aria-hidden="true" />
                </div>
                <div className="pb-blueprint-title">
                  <h3 id="blueprint-title">
                    The parts.
                    <br />
                    The bigger picture.
                  </h3>
                  <span className="pb-drawing-number" aria-hidden="true">
                    V / 01
                  </span>
                </div>
                <div className="pb-flow">
                  {stackLayers
                    .filter((item) => item.id !== "integrations")
                    .map((item, index) => {
                      const RowIcon = icons[item.id];
                      const selected = optionFor(
                        item.id,
                        selection.core[item.id as CoreLayer],
                      );
                      return (
                        <button
                          type="button"
                          key={item.id}
                          className={`pb-flow-node ${active === index ? "is-current" : ""}`}
                          onClick={() => {
                            setActive(index);
                            tabRefs.current[index]?.focus();
                          }}
                          aria-label={`Edit ${item.label}: ${selected.name}`}
                        >
                          <span className="pb-flow-icon">
                            <RowIcon size={18} strokeWidth={1.5} />
                          </span>
                          <span>
                            <small>{item.label}</small>
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.strong
                                key={selected.id}
                                initial={{
                                  opacity: reduced ? 1 : 0,
                                  x: reduced ? 0 : 5,
                                }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: reduced ? 1 : 0 }}
                                transition={transition}
                              >
                                {selected.name}
                              </motion.strong>
                            </AnimatePresence>
                          </span>
                          <ArrowUpRight size={14} className="pb-node-edit" />
                        </button>
                      );
                    })}
                </div>
                <div className="pb-connections">
                  <div>
                    <Network size={16} />
                    <span className="pb-tiny-label">CONNECTIONS</span>
                    <span>
                      {selection.integrations.length
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </div>
                  <div className="pb-connection-list">
                    {selection.integrations.length ? (
                      selection.integrations.map((id) => (
                        <motion.span
                          key={id}
                          initial={{ opacity: reduced ? 1 : 0 }}
                          animate={{ opacity: 1 }}
                          transition={transition}
                        >
                          {optionFor("integrations", id).name}
                        </motion.span>
                      ))
                    ) : (
                      <p>No external connections selected.</p>
                    )}
                  </div>
                </div>
                <div className="pb-blueprint-foot">
                  <span>EXPLORATORY ARCHITECTURE</span>
                  <span>
                    05 LAYERS /{" "}
                    {selection.integrations.length.toString().padStart(2, "0")}{" "}
                    CONNECTIONS
                  </span>
                </div>
              </aside>
            </div>
            <p className="pb-workspace-caption">
              A place to explore decisions. Final architecture, compatibility
              and performance need validation against your product’s
              requirements.
            </p>
          </section>
          <section
            className="pb-review page-container"
            id="stack-review"
            aria-labelledby="review-title"
          >
            <Reveal className="pb-review-intro">
              <span className="pb-tiny-label">BEFORE THE FIRST BUILD</span>
              <h2 id="review-title">
                Good questions.
                <br />
                <span>Stronger foundations.</span>
              </h2>
              <p>
                Based on your choices, here are the conversations to have next.
              </p>
              <div className="pb-brief-actions">
                <button
                  type="button"
                  className="pill-button dark"
                  onClick={copyBrief}
                >
                  {copyState === "copied" ? (
                    <CheckCheck size={17} />
                  ) : (
                    <Copy size={17} />
                  )}
                  {copyState === "copied"
                    ? "Brief copied"
                    : "Copy your stack brief"}
                </button>
                <Link href="/contact" className="text-link">
                  Talk it through <ArrowUpRight size={17} />
                </Link>
              </div>
              <p className="pb-copy-status" role="status">
                {copyState === "copied"
                  ? "Your selected stack and review questions are ready to paste."
                  : copyState === "failed"
                    ? "Clipboard access is unavailable. Select and copy the brief below."
                    : "No sign-up. Your choices stay in this browser tab."}
              </p>
              {copyState === "failed" && (
                <textarea
                  className="pb-copy-fallback"
                  aria-label="Architecture brief to copy"
                  readOnly
                  value={spec}
                  onFocus={(event) => event.target.select()}
                />
              )}
            </Reveal>
            <div className="pb-review-notes">
              {notes.map((note, index) => (
                <Reveal key={note.title} delay={Math.min(index * 0.04, 0.16)}>
                  <article className="pb-review-note">
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{note.title}</h3>
                      <p>{note.text}</p>
                    </div>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        </main>
        <PageFooter />
      </div>
    </ExperienceProvider>
  );
}
