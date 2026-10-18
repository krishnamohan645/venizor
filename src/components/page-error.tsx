"use client";

import type { ErrorInfo } from "next/error";
import Link from "next/link";
import { useEffect, useRef, useTransition } from "react";
import { reportClientError } from "@/lib/report-client-error";

export function PageError({ error, retry }: ErrorInfo) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    reportClientError(error, "page");
    heading.current?.focus();
  }, [error]);
  return (
    <div className="page-recovery-shell">
      <header className="page-recovery-nav">
        <Link
          href="/"
          className="page-recovery-brand"
          aria-label="VENIZOR home"
        >
          VENIZOR<span>®</span>
        </Link>
        <nav aria-label="Recovery navigation">
          <Link href="/">Home</Link>
          <Link href="/blog">Field notes</Link>
          <Link href="/contact">Contact us</Link>
        </nav>
      </header>
      <main className="page-recovery-main" id="main">
        <span className="section-kicker">LET’S PICK UP WHERE WE LEFT OFF</span>
        <h1 ref={heading} tabIndex={-1}>
          This page needs
          <br />
          <span>a moment.</span>
        </h1>
        <p>
          Something interrupted this page. Try loading it again, or continue to
          another part of the site.
        </p>
        <div className="page-recovery-actions">
          <button
            type="button"
            className="pill-button dark"
            onClick={() => startTransition(() => retry())}
            disabled={pending}
          >
            {pending ? "Trying again…" : "Try again"}
          </button>
          <Link href="/" className="text-link">
            Go to homepage <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <p className="page-recovery-status" role="status">
          {pending
            ? "Reloading this page."
            : "If the problem continues, you can reach us by email."}
        </p>
        <a className="page-recovery-email" href="mailto:info@venizor.com">
          info@venizor.com
        </a>
      </main>
      <footer className="page-recovery-footer">
        <span>VENIZOR / INDEPENDENT THINKING. CONNECTED POSSIBILITIES.</span>
        <Link href="/services">
          Explore our services <span aria-hidden="true">↗</span>
        </Link>
      </footer>
    </div>
  );
}
