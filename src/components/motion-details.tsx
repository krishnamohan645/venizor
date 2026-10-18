"use client";

import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useInView, useReducedMotion } from "motion/react";
import gsap from "gsap";

/** A supplementary pointer cue. The native cursor remains available everywhere. */
export function CursorFollower() {
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const el = ring.current!;
        const x = gsap.quickTo(el, "x", { duration: 0.24, ease: "power3.out" });
        const y = gsap.quickTo(el, "y", { duration: 0.24, ease: "power3.out" });
        let visible = false;
        const hide = () => {
          visible = false;
          el.style.opacity = "0";
        };
        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") {
            hide();
            return;
          }
          if (!visible) {
            gsap.set(el, { x: event.clientX, y: event.clientY });
            visible = true;
          }
          x(event.clientX);
          y(event.clientY);
          el.style.opacity = "1";
          const target = event.target as Element;
          el.dataset.interactive = String(
            Boolean(target.closest("a,button,input,textarea,select")),
          );
          el.dataset.drag = String(
            Boolean(target.closest(".industry-sticker")),
          );
        };
        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", hide);
        window.addEventListener("blur", hide);
        const focus = (event: KeyboardEvent) => {
          if (event.key === "Tab") hide();
        };
        window.addEventListener("keydown", focus);
        return () => {
          window.removeEventListener("pointermove", move);
          document.documentElement.removeEventListener("pointerleave", hide);
          window.removeEventListener("blur", hide);
          window.removeEventListener("keydown", focus);
          hide();
        };
      },
    );
    return () => media.revert();
  }, []);
  return (
    <div className="cursor-follower" ref={ring} aria-hidden="true">
      <i />
      <span>DRAG</span>
    </div>
  );
}

export function ProductMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "50px" });
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const animation = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const loop = gsap.timeline({ repeat: -1, paused: true });
        animation.current = loop;
        loop
          .to(
            ".product-ribbons",
            { y: 16, duration: 3, ease: "sine.inOut", yoyo: true, repeat: 1 },
            0,
          )
          .to(".clarity-orb", { rotation: 180, duration: 6, ease: "none" }, 0)
          .fromTo(
            ".mini-flow > span",
            { scale: 1 },
            {
              scale: 1.18,
              duration: 0.55,
              stagger: 0.5,
              yoyo: true,
              repeat: 1,
              ease: "sine.inOut",
            },
            0,
          )
          .fromTo(
            ".mini-flow > i",
            { scaleX: 0.25, opacity: 0.3 },
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.65,
              stagger: 0.5,
              yoyo: true,
              repeat: 1,
            },
            0.4,
          );
        return () => {
          animation.current = null;
        };
      },
      root,
    );
    return () => media.revert();
  }, []);
  useEffect(() => {
    animation.current?.paused(paused || !inView || Boolean(reduced));
  }, [paused, inView, reduced]);
  return (
    <div className="product-motion" ref={root} data-motion-paused={paused}>
      {children}
      <button
        className="text-link product-motion-toggle"
        onClick={() => setPaused(!paused)}
        aria-label={
          paused ? "Play product animations" : "Pause product animations"
        }
      >
        <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{" "}
        {paused ? "Play" : "Pause"} product motion
      </button>
    </div>
  );
}

const DEFAULT_HERO_WORDS = [
  "execution.",
  "innovation.",
  "momentum.",
  "precision.",
  "scale.",
  "velocity.",
];

export function HeroWordsCycle({
  words = DEFAULT_HERO_WORDS,
  initialDelayMs = 2000,
  intervalMs = 2600,
}: {
  words?: string[];
  initialDelayMs?: number;
  intervalMs?: number;
}) {
  const [state, setState] = useState<{
    current: number;
    prev: number | null;
    isAnimating: boolean;
  }>({
    current: 0,
    prev: null,
    isAnimating: false,
  });

  const animTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);

  const advance = () => {
    setState((prev) => ({
      current: (prev.current + 1) % words.length,
      prev: prev.current,
      isAnimating: true,
    }));

    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        prev: null,
        isAnimating: false,
      }));
    }, 500);
  };

  useEffect(() => {
    const heroSection = document.querySelector(".studio-hero");
    if (!heroSection) return;

    const updatePaused = () => {
      isPausedRef.current =
        heroSection.getAttribute("data-motion-paused") === "true";
    };
    updatePaused();

    const observer = new MutationObserver(updatePaused);
    observer.observe(heroSection, {
      attributes: true,
      attributeFilter: ["data-motion-paused"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const startCycle = () => {
      if (!isPausedRef.current) advance();
      cycleTimerRef.current = setInterval(() => {
        if (!isPausedRef.current) advance();
      }, intervalMs);
    };

    const initialTimer = setTimeout(startCycle, initialDelayMs);

    return () => {
      clearTimeout(initialTimer);
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, [initialDelayMs, intervalMs]);

  const { current, prev, isAnimating } = state;

  return (
    <span
      className="hero-word-rotator"
      role="button"
      tabIndex={0}
      title="Click to cycle next word"
      aria-label={`Vision meets ${words[current].replace(".", "")}. Click to cycle.`}
      onClick={advance}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          advance();
        }
      }}
    >
      <span className="hero-word-track">
        {isAnimating && prev !== null && (
          <span className="hero-word-slide hero-word-exit" aria-hidden="true">
            <span className="hero-word-text">{words[prev]}</span>
            <span className="hero-asterisk" aria-hidden="true">
              ✳
            </span>
          </span>
        )}
        <span
          className={`hero-word-slide ${
            isAnimating ? "hero-word-enter" : "hero-word-current"
          }`}
        >
          <span className="hero-word-text">{words[current]}</span>
          <span className="hero-asterisk" aria-hidden="true">
            ✳
          </span>
        </span>
      </span>
    </span>
  );
}
