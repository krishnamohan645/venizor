"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { useExperienceDialog, DetailButton } from "./experience";

interface PageHeaderProps {
  activePage?: "home" | "about" | "contact" | "blog";
}

export function PageHeader({ activePage = "home" }: PageHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useExperienceDialog();
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="studio-header page-header">
      <Link className="brand-logo" href="/" aria-label="VENIZOR home">
        <Image
          src="/logo-banner.jpeg"
          width={1600}
          height={800}
          alt="VENIZOR — Innovate with confidence"
          preload
        />
      </Link>

      <nav
        id="page-navigation"
        className={`studio-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className={activePage === "home" ? "active-nav-link" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Home
          <sup>01</sup>
        </Link>
        <Link
          href="/about"
          className={activePage === "about" ? "active-nav-link" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Who we are
          <sup>02</sup>
        </Link>
        <Link href="/#services" onClick={() => setMenuOpen(false)}>
          Services
          <sup>03</sup>
        </Link>
        <Link href="/#work" onClick={() => setMenuOpen(false)}>
          Our work
          <sup>04</sup>
        </Link>
        <Link href="/#products" onClick={() => setMenuOpen(false)}>
          Products
          <sup>05</sup>
        </Link>
        <Link
          href="/blog"
          className={activePage === "blog" ? "active-nav-link" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Blog
          <sup>06</sup>
        </Link>
        <Link
          href="/contact"
          className={activePage === "contact" ? "active-nav-link" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Contact us
          <sup>07</sup>
        </Link>

        <Link
          className="mobile-contact"
          href="/contact"
          onClick={() => setMenuOpen(false)}
        >
          Start a project
          <ArrowUpRight size={16} />
        </Link>
      </nav>

      <div className="studio-header-actions">
        <button
          className="icon-button search-button"
          aria-label="Search site"
          onClick={() => dialog({ type: "search" })}
        >
          <Search size={18} />
        </button>
        <Link href="/contact" className="pill-button dark header-contact">
          Let’s talk <ArrowUpRight size={16} />
        </Link>
        <button
          ref={menuButton}
          className="icon-button menu-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="page-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
    </header>
  );
}

export function PageFooter() {
  return (
    <footer className="studio-footer page-inner-footer">
      <div className="footer-content page-container">
        <div className="footer-top">
          <span className="section-kicker">YOUR NEXT CHAPTER</span>
          <span>
            <i className="live-dot" /> OPEN TO GOOD CONVERSATIONS
          </span>
        </div>
        <div className="footer-invitation">
          <h2>
            Something great
            <br />
            starts with <em>hello.</em>
          </h2>
          <Link href="/contact" className="footer-contact-circle">
            <ArrowUpRight size={48} strokeWidth={1.15} />
            <span>LET’S MAKE IT HAPPEN</span>
          </Link>
        </div>
        <div className="footer-connect">
          <a href="mailto:info@venizor.com">
            info@venizor.com <ArrowUpRight size={20} />
          </a>
          <Link href="/contact" className="text-link">
            Schedule a free consultation <ArrowUpRight size={18} />
          </Link>
          <span>BASED IN INDIA. BUILDING FOR THE WORLD.</span>
        </div>
        <div className="footer-nav">
          <Link href="/">Home</Link>
          <Link href="/about">Who we are</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#work">Our work</Link>
          <Link href="/#products">Products</Link>
          <Link href="/blog">Blog &amp; Field Notes</Link>
          <Link href="/playbook">Stack Playbook</Link>
          <Link href="/simulator">Pipeline Simulator</Link>
          <Link href="/case-studies">Case Studies</Link>
          <Link href="/tools">Developer Tools</Link>
          <Link href="/scope">Scope Wizard</Link>
          <Link href="/contact">Contact us</Link>
          <a href="#top" className="footer-back-top">
            Back to top <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="footer-wordmark" aria-label="VENIZOR">
          VENIZOR<span>®</span>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VENIZOR. INNOVATE WITH CONFIDENCE.</span>
          <div>
            <DetailButton
              className="legal-link"
              title="Privacy"
              description="This website does not use advertising cookies or collect form submissions on a server. Project enquiries are prepared in your email application and are only sent when you choose to send them. Your email provider’s privacy terms apply."
            >
              Privacy
            </DetailButton>
            <DetailButton
              className="legal-link"
              title="Website terms"
              description="The work shown includes illustrative concept demonstrations. Product information describes development plans. Project scope, fees, timelines, and service terms are agreed separately in writing."
            >
              Terms
            </DetailButton>
          </div>
        </div>
      </div>
    </footer>
  );
}
