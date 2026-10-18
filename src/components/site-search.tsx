"use client";

import { ArrowUpRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { searchEntries, type SearchEntry } from "@/lib/search";
import { scrollPageTo } from "@/lib/smooth-scroll";

export function SiteSearch({ onNavigate }: { onNavigate: () => void }) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/search", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Search unavailable");
        const data = await response.json();
        if (!Array.isArray(data.entries))
          throw new Error("Invalid search index");
        if (!controller.signal.aborted) setEntries(data.entries);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [attempt]);

  const results = searchEntries(entries || [], query);
  return (
    <>
      <p className="eyebrow">FIND YOUR WAY</p>
      <h2 id="dialog-title">What’s on your mind?</h2>
      <div className="search-field">
        <Search size={22} aria-hidden="true" />
        <input
          ref={input}
          data-dialog-autofocus
          type="search"
          aria-label="Search this site"
          aria-controls="site-search-results"
          placeholder="Search pages, services, articles…"
          value={query}
          maxLength={160}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button
            type="button"
            className="site-search-clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              input.current?.focus();
            }}
          >
            <X size={17} />
          </button>
        )}
      </div>
      <div className="site-search-topics" aria-label="Suggested searches">
        {["Playbook", "Simulator", "Careers", "Tools", "Blog", "Scope"].map(
          (tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={query === tag}
              onClick={() => {
                setQuery(tag);
                input.current?.focus();
              }}
            >
              {tag}
            </button>
          ),
        )}
      </div>
      <p className="site-search-status" role="status" aria-live="polite">
        {failed
          ? "Search is temporarily unavailable."
          : !entries
            ? "Loading site content…"
            : `${results.length} ${results.length === 1 ? "result" : "results"}${query.trim() ? ` for “${query.trim()}”` : " · Explore the site"}`}
      </p>
      <div
        className="search-results"
        id="site-search-results"
        aria-busy={!entries && !failed}
      >
        {entries &&
          results.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              prefetch={false}
              onNavigate={(event) => {
                const destination = new URL(entry.href, location.origin);
                const target =
                  destination.pathname === location.pathname && destination.hash
                    ? document.getElementById(destination.hash.slice(1))
                    : null;
                onNavigate();
                if (target) {
                  event.preventDefault();
                  // Let the dialog release its scroll lock before the shared scroller moves.
                  requestAnimationFrame(() => {
                    if (location.href !== destination.href)
                      history.pushState(null, "", entry.href);
                    const previousTabIndex = target.getAttribute("tabindex");
                    target.setAttribute("tabindex", "-1");
                    target.focus({ preventScroll: true });
                    target.addEventListener(
                      "blur",
                      () => {
                        if (previousTabIndex === null)
                          target.removeAttribute("tabindex");
                        else target.setAttribute("tabindex", previousTabIndex);
                      },
                      { once: true },
                    );
                    scrollPageTo(target);
                  });
                }
              }}
            >
              <span className="site-search-copy">
                <span className="site-search-kind">{entry.kind}</span>
                <span className="site-search-title">{entry.title}</span>
                <span className="site-search-description">
                  {entry.description}
                </span>
              </span>
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          ))}
        {entries && results.length === 0 && (
          <div className="site-search-empty">
            <p>
              No matches yet. Try a topic such as “API”, “web development” or
              “AI”.
            </p>
            <Link className="text-link" href="/contact" onNavigate={onNavigate}>
              Tell us what you need <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
        {failed && (
          <div className="site-search-empty">
            <p>You can still explore our services or contact the studio.</p>
            <button
              className="text-link"
              type="button"
              onClick={() => {
                setFailed(false);
                setAttempt((value) => value + 1);
              }}
            >
              Try search again
            </button>
            <Link
              className="text-link"
              href="/services"
              onNavigate={onNavigate}
            >
              Explore services <ArrowUpRight size={16} />
            </Link>
            <Link className="text-link" href="/contact" onNavigate={onNavigate}>
              Contact us <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
