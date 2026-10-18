"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { DetailButton, ProjectPreview } from "./experience";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type Project = {
  name: string;
  type: "website" | "dashboard" | "mobile" | "automation";
  tag: string;
  title: string;
  description: string;
  background: string;
  features: string[];
};

export function ScrollProjectGallery({ projects }: { projects: Project[] }) {
  const scene = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const scroll = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [previewPaused, setPreviewPaused] = useState(false);
  const inView = useInView(scene);
  const reduced = useReducedMotion();

  const activate = useCallback(
    (index: number) => {
      index = Math.max(0, Math.min(projects.length - 1, index));
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
      }
    },
    [projects.length],
  );

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    let restoreFrame = 0;
    media.add(
      "(min-width: 961px) and (prefers-reduced-motion: no-preference)",
      () => {
        const root = scene.current!;
        root.dataset.scroll = "true";
        viewport.current!.scrollLeft = 0;
        const movement = gsap.to(track.current, {
          x: () =>
            -Math.max(
              0,
              (track.current?.scrollWidth ?? 0) -
                (viewport.current?.clientWidth ?? 0),
            ),
          ease: "none",
          scrollTrigger: {
            id: "project-story",
            trigger: root,
            start: "top 24px",
            end: "bottom bottom-=24px",
            scrub: 0.55,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              activate(
                Math.min(
                  projects.length - 1,
                  Math.round(self.progress * (projects.length - 1)),
                ),
              ),
          },
        });
        scroll.current = movement.scrollTrigger!;
        return () => {
          const selected = activeRef.current;
          delete root.dataset.scroll;
          scroll.current = null;
          restoreFrame = requestAnimationFrame(() => {
            if (viewport.current?.isConnected && !scroll.current) {
              viewport.current.scrollTo({
                left: selected * viewport.current.clientWidth,
                behavior: "instant",
              });
              activate(selected);
            }
          });
        };
      },
      scene,
    );
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refresh);
      media.revert();
      cancelAnimationFrame(restoreFrame);
    };
  }, [projects.length, activate]);

  const select = (index: number, keyboard = false) => {
    gsap.killTweensOf(window);
    activate(index);
    const story = scroll.current;
    if (story) {
      const destination =
        story.start +
        (index / (projects.length - 1)) * (story.end - story.start);
      if (keyboard) {
        window.scrollTo({ top: destination, behavior: "instant" });
        story.update();
        story.getTween()?.progress(1);
        story.animation?.progress(index / (projects.length - 1));
      } else {
        gsap.to(window, {
          scrollTo: { y: destination, autoKill: true },
          duration: 0.65,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    } else {
      viewport.current?.scrollTo({
        left: index * viewport.current.clientWidth,
        behavior: keyboard || reduced ? "instant" : "smooth",
      });
    }
  };

  return (
    <div
      ref={scene}
      className="project-scroll-section"
      data-active-project={active}
      data-preview-motion={
        inView && !previewPaused && !reduced ? "playing" : "paused"
      }
    >
      <div className="project-pin-shell">
        <div className="work-scroll-hint">
          <span>SELECTED EXPLORATIONS</span>
          <span>
            KEEP SCROLLING <ArrowDown size={13} />
          </span>
        </div>
        <div className="project-slider" aria-label="Project concepts">
          <div
            className="project-selector"
            role="tablist"
            aria-label="Select a project"
            aria-orientation="vertical"
          >
            {projects.map((project, index) => (
              <button
                role="tab"
                id={`project-tab-${index}`}
                key={project.name}
                aria-selected={active === index}
                aria-controls="project-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={(event) => select(index, event.detail === 0)}
                onKeyDown={(event) => {
                  const directions: Record<string, number> = {
                    ArrowDown: 1,
                    ArrowRight: 1,
                    ArrowUp: -1,
                    ArrowLeft: -1,
                  };
                  if (directions[event.key]) {
                    event.preventDefault();
                    const next =
                      (index + directions[event.key] + projects.length) %
                      projects.length;
                    select(next, true);
                    document
                      .getElementById(`project-tab-${next}`)
                      ?.focus({ preventScroll: true });
                  }
                }}
              >
                <span>0{index + 1}</span>
                {project.name}
                <ArrowUpRight size={20} />
              </button>
            ))}
            <div className="project-story-note">
              <span className="project-current-number">0{active + 1}</span>
              <p key={active} className="project-live-description">
                {projects[active].description}
              </p>
              <div className="project-disciplines" key={`tags-${active}`}>
                {projects[active].features.slice(0, 2).map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>
            </div>
          </div>
          <div
            className="project-stage"
            id="project-panel"
            role="tabpanel"
            aria-labelledby={`project-tab-${active}`}
          >
            <div
              className="project-viewport"
              ref={viewport}
              onScroll={(event) => {
                if (!scroll.current)
                  activate(
                    Math.round(
                      event.currentTarget.scrollLeft /
                        event.currentTarget.clientWidth,
                    ),
                  );
              }}
            >
              <div className="project-scroll-track" ref={track}>
                {projects.map((project, index) => (
                  <div
                    className={`project-slide theme-${project.background}`}
                    key={project.name}
                    aria-hidden={active !== index}
                    inert={active !== index}
                    data-active={active === index}
                  >
                    <span className="project-slide-tag">{project.tag}</span>
                    <h3>{project.title}</h3>
                    <div className="large-project-preview">
                      <ProjectPreview type={project.type} />
                    </div>
                    <DetailButton
                      className="project-open"
                      title={project.name}
                      description={project.description}
                      features={project.features}
                    >
                      <span>Explore concept</span>
                      <ArrowUpRight size={22} />
                    </DetailButton>
                    <span className="concept-label">
                      CONCEPT EXPLORATION · 2026
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="project-controls">
              <span>
                <b>0{active + 1}</b> / 0{projects.length}
              </span>
              <div className="slider-progress">
                {projects.map((project, index) => (
                  <button
                    key={project.name}
                    aria-label={`Show ${project.name} project`}
                    aria-pressed={active === index}
                    onClick={(event) => select(index, event.detail === 0)}
                    className={active === index ? "active" : ""}
                  />
                ))}
              </div>
              <div>
                <button
                  className="round-button project-preview-toggle"
                  aria-label={
                    previewPaused
                      ? "Play project preview motion"
                      : "Pause project preview motion"
                  }
                  onClick={() => setPreviewPaused(!previewPaused)}
                >
                  <span aria-hidden="true">{previewPaused ? "▷" : "Ⅱ"}</span>
                </button>
                <button
                  className="round-button"
                  aria-label="Previous project"
                  onClick={(event) =>
                    select(
                      (active - 1 + projects.length) % projects.length,
                      event.detail === 0,
                    )
                  }
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  className="round-button"
                  aria-label="Next project"
                  onClick={(event) =>
                    select((active + 1) % projects.length, event.detail === 0)
                  }
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
