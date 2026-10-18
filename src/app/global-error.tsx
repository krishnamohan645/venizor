"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- This standalone document must recover even when the root router/layout fails. */
import type { ErrorInfo } from "next/error";
import { useEffect } from "react";
import { reportClientError } from "@/lib/report-client-error";
export default function GlobalError({ error, retry }: ErrorInfo) {
  useEffect(() => {
    reportClientError(error, "root-layout");
  }, [error]);
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <head>
        <title>Page recovery | VENIZOR</title>
        <meta name="robots" content="noindex" />
      </head>
      <body
        style={{
          fontFamily: "Geist, sans-serif",
          padding: "10vh 8vw",
          background: "#fcfcfa",
          color: "#151719",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        <main style={{ maxWidth: 720, margin: "0 auto" }}>
          <a href="/" style={{ color: "inherit", fontWeight: 700 }}>
            VENIZOR
          </a>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              marginTop: 64,
            }}
          >
            Something interrupted this page.
          </h1>
          <p>
            Please try again, or email info@venizor.com if the problem
            continues.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "center",
              marginTop: 32,
            }}
          >
            <button
              onClick={retry}
              style={{
                background: "#164df4",
                color: "#fff",
                padding: "14px 24px",
                border: 0,
                borderRadius: 999,
                font: "inherit",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a href="/" style={{ color: "#1740b6" }}>
              Go to homepage
            </a>
            <a href="/contact" style={{ color: "#1740b6" }}>
              Contact us
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
