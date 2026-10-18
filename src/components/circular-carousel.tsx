"use client";
import { scenarios } from "@/data/scenarios";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { StudioVisual, type SceneKind } from "./studio-visual";

export function CircularCarousel() {
  const [active, setActive] = useState(0),
    [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const item = scenarios[active];
  const change = (direction: number) =>
    setActive(
      (current) => (current + direction + scenarios.length) % scenarios.length,
    );
  return (
    <section
      className="showcase"
      aria-label="Illustrative architecture scenarios"
      aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          change(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          change(-1);
        }
      }}
      tabIndex={0}
    >
      <div className="showcase-heading">
        <div>
          <span className="section-kicker">THE THINKING, MADE TANGIBLE</span>
          <h3>Explore a possibility.</h3>
        </div>
        <div className="showcase-controls">
          <button
            className="icon-button"
            aria-label={
              paused ? "Play scenario motion" : "Pause scenario motion"
            }
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            className="round-button"
            aria-label="Previous scenario"
            onClick={() => change(-1)}
          >
            <ArrowLeft size={18} />
          </button>
          <span className="showcase-count">
            0{active + 1} / 0{scenarios.length}
          </span>
          <button
            className="round-button"
            aria-label="Next scenario"
            onClick={() => change(1)}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div className="showcase-stage">
        <div className="showcase-story">
          <span className="section-kicker">
            ILLUSTRATIVE / {item.industry.toUpperCase()}
          </span>
          <div className="showcase-copy-layer">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={item.id}
                initial={reduced || paused ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced || paused ? 0 : -4 }}
                transition={{
                  duration: reduced || paused ? 0 : 0.22,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <h4>{item.name}</h4>
                <p>{item.summary}</p>
                <div className="showcase-stack">
                  {item.stack.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </div>
                <Link className="text-link" href={`/case-studies#${item.id}`}>
                  Explore the scenario <ArrowUpRight size={18} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="showcase-note">
            A design exploration. No client results or production benchmarks are
            implied.
          </span>
        </div>
        <div className="showcase-visual-stage">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={item.id}
              initial={
                reduced || paused ? false : { opacity: 0, x: 16, scale: 0.99 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: reduced || paused ? 0 : -8 }}
              transition={{
                duration: reduced || paused ? 0 : 0.28,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <StudioVisual kind={item.id as SceneKind} paused={paused} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div
        className="showcase-selector"
        aria-label="Choose an architecture scenario"
      >
        {scenarios.map((scenario, index) => (
          <button
            type="button"
            key={scenario.id}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span>0{index + 1}</span>
            {scenario.industry}
            <i />
          </button>
        ))}
      </div>
      <span className="sr-only" role="status">
        Scenario {active + 1} of {scenarios.length}: {item.name}
      </span>
    </section>
  );
}
