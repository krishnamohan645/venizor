"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, CheckCheck, Clock, Copy, Mail, MapPin, Send, Sparkles } from "lucide-react";

const availableServices = [
  "SaaS Platform",
  "AI & Automation",
  "Web Application",
  "Mobile App",
  "Digital Growth",
  "Product Design",
  "Technical Consultation",
];

export function InteractiveContactForm() {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "SaaS Platform",
  ]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [timeline, setTimeline] = useState("1 – 3 months");
  const [budget, setBudget] = useState("$15,000 – $35,000");
  const [message, setMessage] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [draftLink, setDraftLink] = useState("");
  const [copied, setCopied] = useState(false);

  const toggleService = (srv: string) => {
    setDraftReady(false);
    setSelectedServices((prev) =>
      prev.includes(srv)
        ? prev.length > 1
          ? prev.filter((s) => s !== srv)
          : prev
        : [...prev, srv],
    );
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const serviceList = selectedServices.join(", ");
    const subject = `Project Enquiry: ${serviceList} — ${name}${company ? ` (${company})` : ""}`;
    const body = `Hello VENIZOR Studio,

${message}

---
PROJECT PARAMETERS:
• Interested in: ${serviceList}
• Estimated Timeline: ${timeline}
• Budget Range: ${budget}
• Contact Name: ${name}
• Work Email: ${email}
${company ? `• Organization: ${company}\n` : ""}`;

    const mailto = `mailto:info@venizor.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setDraftLink(mailto);
    setDraftReady(true);
  };

  const copyToClipboard = () => {
    const serviceList = selectedServices.join(", ");
    const text = `Project Enquiry for VENIZOR
From: ${name} (${email}${company ? `, ${company}` : ""})
Services: ${serviceList}
Timeline: ${timeline}
Budget: ${budget}

Message:
${message}`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="contact-form-panel">
      <h3>Tell us about your project</h3>
      <p className="contact-form-sub">
        Fill out the parameters below to prepare your direct project enquiry.
      </p>

      <form className="contact-form" onSubmit={handleFormSubmit}>
        <div className="form-field-row">
          <div className="contact-field-group">
            <label htmlFor="contact-name">Your Name *</label>
            <input
              id="contact-name"
              type="text"
              required
              maxLength={100}
              placeholder="Alex Morgan"
              className="contact-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setDraftReady(false);
              }}
            />
          </div>

          <div className="contact-field-group">
            <label htmlFor="contact-email">Work Email *</label>
            <input
              id="contact-email"
              type="email"
              required
              maxLength={180}
              placeholder="alex@company.com"
              className="contact-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setDraftReady(false);
              }}
            />
          </div>
        </div>

        <div className="form-field-row">
          <div className="contact-field-group">
            <label htmlFor="contact-company">Company / Organization</label>
            <input
              id="contact-company"
              type="text"
              maxLength={100}
              placeholder="Acme Studio, Inc."
              className="contact-input"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setDraftReady(false);
              }}
            />
          </div>

          <div className="contact-field-group">
            <label htmlFor="contact-timeline">Desired Timeline</label>
            <select
              id="contact-timeline"
              className="contact-select"
              value={timeline}
              onChange={(e) => {
                setTimeline(e.target.value);
                setDraftReady(false);
              }}
            >
              <option>Immediate (&lt; 1 month)</option>
              <option>1 – 3 months</option>
              <option>3 – 6 months</option>
              <option>Flexible / Exploratory</option>
            </select>
          </div>
        </div>

        <div className="contact-field-group">
          <span className="pills-label">Services of Interest *</span>
          <div className="services-pills-wrap">
            {availableServices.map((srv) => {
              const active = selectedServices.includes(srv);
              return (
                <button
                  type="button"
                  key={srv}
                  className="service-toggle-pill"
                  data-selected={active}
                  onClick={() => toggleService(srv)}
                >
                  {srv} {active && "✓"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="contact-field-group">
          <label htmlFor="contact-budget">Estimated Budget Scope</label>
          <select
            id="contact-budget"
            className="contact-select"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
              setDraftReady(false);
            }}
          >
            <option>&lt; $5,000 (Focused release)</option>
            <option>$5,000 – $15,000 (MVP / New Product)</option>
            <option>$15,000 – $35,000 (Comprehensive platform)</option>
            <option>$35,000+ (Enterprise scale / Retainer pod)</option>
          </select>
        </div>

        <div className="contact-field-group">
          <label htmlFor="contact-message">Project Brief &amp; Goals *</label>
          <textarea
            id="contact-message"
            required
            placeholder="Share details about what you are aiming to build, key challenges, or current status..."
            className="contact-textarea"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setDraftReady(false);
            }}
          />
        </div>

        <div className="form-actions-wrap">
          <button type="submit" className="contact-submit-btn">
            Prepare Your Project Enquiry <Send size={15} />
          </button>

          {draftReady && (
            <div className="draft-confirmation-card">
              <div className="draft-conf-title">
                <Check size={18} />
                <span>Enquiry prepared and ready to send!</span>
              </div>
              <p className="draft-conf-desc">
                Your email client is ready with the structured brief. Click below to launch your email app, or copy the content directly.
              </p>
              <div className="draft-buttons-row">
                <a
                  href={draftLink}
                  className="draft-launch-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in your email app <ArrowUpRight size={14} />
                </a>
                <button
                  type="button"
                  className="draft-copy-btn"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <>
                      <CheckCheck size={14} /> Copied to clipboard!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy brief details
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

/** Live Studio Timezone Clock for India (IST, UTC+5:30) */
export function StudioLiveClock() {
  const [timeStr, setTimeStr] = useState<string>("02:30 PM");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now);
        setTimeStr(formatted);
      } catch {
        setTimeStr("12:00 PM");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar-info-card">
      <span className="sidebar-kicker">STUDIO TELEMETRY</span>
      <h4>India Headquarters (IST)</h4>
      <p>
        Building from India with active communication overlap across US, European, and APAC client timezones.
      </p>

      <div className="clock-display-wrap">
        <span className="clock-time-val">{timeStr}</span>
        <span className="clock-tz-val">IST (UTC +5:30)</span>
      </div>

      <div className="clock-status-tag">
        <i className="pulse-dot" style={{ width: 6, height: 6 }} /> Currently receiving project briefs
      </div>
    </div>
  );
}
