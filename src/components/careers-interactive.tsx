"use client";

import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";

export interface Role {
  id: string;
  title: string;
  department: string;
  salaryMin: number;
  salaryMax: number;
  salaryDisplay: string;
  location: string;
  type: string;
  tags: string[];
  overview: string;
  responsibilities: string[];
  requirements: string[];
}

export function CareersFilterableList({ roles }: { roles: Role[] }) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [applicationSent, setApplicationSent] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateUrl, setCandidateUrl] = useState("");
  const [candidateNotes, setCandidateNotes] = useState("");

  const departments = [
    "All",
    "Distributed Systems",
    "Applied AI",
    "Cloud & Security",
    "Product & Design",
  ];

  const filteredRoles =
    selectedDept === "All"
      ? roles
      : roles.filter((r) => r.department === selectedDept);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidateEmail) return;

    // Open mailto fallback pre-filled
    const subject = encodeURIComponent(
      `VENIZOR Engineering Application: ${activeRole?.title} - ${candidateName}`,
    );
    const body = encodeURIComponent(
      `Role: ${activeRole?.title}\nCandidate Name: ${candidateName}\nEmail: ${candidateEmail}\nPortfolio/GitHub: ${candidateUrl}\n\nTechnical Problem Solved:\n${candidateNotes}`,
    );

    window.open(
      `mailto:careers@venizor.com?subject=${subject}&body=${body}`,
      "_blank",
    );
    setApplicationSent(true);
  };

  const closeModal = () => {
    setActiveRole(null);
    setApplicationSent(false);
  };

  return (
    <div className="careers-interactive-wrap">
      {/* Department Filter Pills */}
      <div className="careers-filter-bar">
        {departments.map((dept) => (
          <button
            key={dept}
            type="button"
            className="careers-dept-pill"
            data-active={selectedDept === dept}
            onClick={() => setSelectedDept(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Role Cards List */}
      <div className="roles-grid">
        {filteredRoles.map((role) => (
          <article key={role.id} className="role-card">
            <div className="role-card-header">
              <span className="role-dept-tag">{role.department}</span>
              <span className="role-salary-tag">{role.salaryDisplay}</span>
            </div>

            <h3 className="role-card-title">{role.title}</h3>
            <p className="role-card-overview">{role.overview}</p>

            <div className="role-meta-row">
              <span className="role-meta-item">
                <MapPin size={14} /> {role.location}
              </span>
              <span className="role-meta-item">
                <Clock size={14} /> {role.type}
              </span>
            </div>

            <div className="role-tags-wrap">
              {role.tags.map((tag) => (
                <span key={tag} className="role-tech-pill">
                  {tag}
                </span>
              ))}
            </div>

            <div className="role-card-footer">
              <button
                type="button"
                className="role-apply-btn"
                onClick={() => {
                  setActiveRole(role);
                  setApplicationSent(false);
                }}
              >
                View Role &amp; Apply <ArrowUpRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Role Details & Application Modal */}
      {activeRole && (
        <div
          className="role-modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="role-modal-container"
            onClick={(e) => e.stopPropagation()}
            aria-labelledby="modal-role-title"
          >
            <button
              type="button"
              className="role-modal-close"
              onClick={closeModal}
              aria-label="Close role modal"
            >
              <X size={20} />
            </button>

            <div className="role-modal-scroll">
              <span className="role-dept-tag">{activeRole.department}</span>
              <h2 id="modal-role-title" className="role-modal-title">
                {activeRole.title}
              </h2>

              <div className="role-modal-stats">
                <div>
                  <span className="stat-label">COMPENSATION</span>
                  <strong className="stat-val">
                    {activeRole.salaryDisplay}
                  </strong>
                </div>
                <div>
                  <span className="stat-label">LOCATION</span>
                  <strong className="stat-val">{activeRole.location}</strong>
                </div>
              </div>

              <div className="role-modal-body">
                <h4>Role Overview</h4>
                <p>{activeRole.overview}</p>

                <h4>Key Responsibilities</h4>
                <ul className="modal-checklist">
                  {activeRole.responsibilities.map((item, idx) => (
                    <li key={idx}>
                      <Check size={16} color="#10b981" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h4>What We Look For</h4>
                <ul className="modal-checklist">
                  {activeRole.requirements.map((item, idx) => (
                    <li key={idx}>
                      <Check size={16} color="#3b82f6" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Application Form */}
              <div className="role-modal-form-section">
                <h3>Direct Engineering Application</h3>
                <p className="form-subtext">
                  Skip the automated HR screening. Your application is reviewed
                  directly by our founding architects within 24 hours.
                </p>

                {applicationSent ? (
                  <div className="application-success-box">
                    <CheckCircle2 size={32} color="#10b981" />
                    <h4>Application Draft Initialized</h4>
                    <p>
                      Your application brief has been prepared for{" "}
                      <strong>careers@venizor.com</strong>. We will review your
                      technical profile and reply within 1 business day.
                    </p>
                    <button
                      type="button"
                      className="pill-button light"
                      onClick={closeModal}
                      style={{ marginTop: 16 }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="role-app-form">
                    <div className="app-form-grid">
                      <div className="app-form-field">
                        <label htmlFor="cand-name">Full Name *</label>
                        <input
                          id="cand-name"
                          type="text"
                          required
                          placeholder="Morgan Taylor"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                        />
                      </div>

                      <div className="app-form-field">
                        <label htmlFor="cand-email">Work Email *</label>
                        <input
                          id="cand-email"
                          type="email"
                          required
                          placeholder="morgan@example.com"
                          value={candidateEmail}
                          onChange={(e) => setCandidateEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="app-form-field">
                      <label htmlFor="cand-url">
                        GitHub, Portfolio, or Technical Profile URL *
                      </label>
                      <input
                        id="cand-url"
                        type="url"
                        required
                        placeholder="https://github.com/username or personal website"
                        value={candidateUrl}
                        onChange={(e) => setCandidateUrl(e.target.value)}
                      />
                    </div>

                    <div className="app-form-field">
                      <label htmlFor="cand-problem">
                        Briefly describe a hard technical bug or distributed
                        system trade-off you solved:
                      </label>
                      <textarea
                        id="cand-problem"
                        rows={4}
                        placeholder="e.g. Diagnosed a distributed race condition in our payment idempotency pipeline by analyzing PostgreSQL WAL replay latency..."
                        value={candidateNotes}
                        onChange={(e) => setCandidateNotes(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="pill-button dark app-submit-btn"
                    >
                      Submit Application Directly <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
