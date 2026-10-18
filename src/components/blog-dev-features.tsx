"use client";

import { storeValue, useStoredValue } from "@/lib/browser-store";
import { scrollPageTo } from "@/lib/smooth-scroll";
import { Bookmark, Check, Copy, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Dev.to style Reading Progress Bar fixed at top of screen
 */
export function ReadingProgressBar() {
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    function handleScroll() {
      frame = 0;
      const el = document.getElementById("article-main");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const current = Math.max(0, -rect.top);
      const progress = Math.min(1, current / total);
      if (fill.current) fill.current.style.transform = `scaleX(${progress})`;
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(handleScroll);
    };
    const observer = new ResizeObserver(schedule);
    const article = document.getElementById("article-main");
    if (article) observer.observe(article);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    handleScroll();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      className="reading-progress-track"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 3,
        zIndex: 99999,
        background: "rgba(0,0,0,0.06)",
        pointerEvents: "none",
      }}
    >
      <div
        ref={fill}
        className="reading-progress-fill"
        style={{
          width: "100%",
          height: "100%",
          background: "var(--blue)",
          transform: "scaleX(0)",
          transformOrigin: "left",
        }}
      />
    </div>
  );
}

/**
 * Dev.to style interactive reaction bar with counters
 */
export function DevReactions({ slug }: { slug: string }) {
  const saved = useStoredValue(`venizor-bookmark-${slug}`) === "true";
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="article-reading-tools">
      <button
        type="button"
        aria-pressed={saved}
        onClick={() => {
          try {
            storeValue(`venizor-bookmark-${slug}`, String(!saved));
            setMessage("Saved preference on this device.");
          } catch {
            setMessage("Your browser could not save this preference.");
          }
        }}
      >
        <Bookmark size={18} />
        {saved ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(location.href);
            setCopied(true);
            setMessage("Article link copied.");
          } catch {
            setMessage(
              "Copy the URL from your address bar to share this article.",
            );
          }
        }}
      >
        {copied ? <Check size={18} /> : <Share2 size={18} />}
        {copied ? "Copied" : "Share"}
      </button>
      <span role="status">{message}</span>
    </div>
  );
}

export function InteractiveCodeBlock({
  code,
  language,
  caption,
}: {
  code: string;
  language: string;
  caption?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  return (
    <div className="interactive-code-container article-code-block">
      <div className="code-header-bar">
        <div className="code-dots" aria-hidden="true">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="code-lang-label">{language.toUpperCase()}</span>
        </div>
        {caption && <span className="code-caption-tag">{caption}</span>}
        <button
          type="button"
          className="code-copy-btn"
          onClick={handleCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy code"}
        >
          {copied ? (
            <>
              <Check size={14} color="#10b981" /> Copied!
            </>
          ) : (
            <>
              <Copy size={14} /> Copy snippet
            </>
          )}
        </button>
      </div>
      <pre className="code-pre-block" tabIndex={0} aria-label="Code example">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Table of Contents with quick smooth scroll
 */
export function ArticleTableOfContents({ headings }: { headings: string[] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollToHeading = (index: number) => {
    setActiveIdx(index);
    const id = `section-${index}`;
    const el = document.getElementById(id);
    if (el) {
      scrollPageTo(el);
    }
  };

  return (
    <nav className="article-toc" aria-label="Table of contents">
      <span className="toc-title">IN THIS ARCHITECTURE GUIDE</span>
      <ul className="toc-list">
        {headings.map((heading, i) => (
          <li key={heading} className={activeIdx === i ? "active" : ""}>
            <button
              type="button"
              className="toc-link"
              onClick={() => scrollToHeading(i)}
            >
              <span className="toc-num">0{i + 1}</span>
              <span className="toc-text">{heading}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
