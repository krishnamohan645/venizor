"use client";

interface IndustryArtProps {
  selected: number;
}

export function IndustryArt({ selected }: IndustryArtProps) {
  return (
    <div className="industry-art-container" key={selected}>
      {selected === 0 && <SaaSArt />}
      {selected === 1 && <EcommerceArt />}
      {selected === 2 && <HealthcareArt />}
      {selected === 3 && <EducationArt />}
      {selected === 4 && <RealEstateArt />}
      {selected === 5 && <ServicesArt />}
      {selected === 6 && <LogisticsArt />}
      {selected === 7 && <BigIdeaArt />}
    </div>
  );
}

/** 01: Technology & SaaS - Live Analytics Dashboard & Node Mesh */
function SaaSArt() {
  return (
    <div className="art-card art-saas">
      <div className="art-mesh-bg" aria-hidden="true">
        <svg viewBox="0 0 320 200" fill="none">
          <circle cx="60" cy="100" r="3" fill="#164df4" opacity="0.4" />
          <circle cx="160" cy="50" r="3" fill="#164df4" opacity="0.4" />
          <circle cx="260" cy="90" r="3" fill="#164df4" opacity="0.4" />
          <circle cx="160" cy="150" r="3" fill="#164df4" opacity="0.4" />
          <path
            d="M60 100L160 50L260 90L160 150Z"
            stroke="#164df4"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <path
            d="M60 100L260 90M160 50L160 150"
            stroke="#164df4"
            strokeWidth="0.8"
            opacity="0.2"
          />
        </svg>
      </div>

      <div className="art-metric-card">
        <div className="art-card-top">
          <span className="art-pill-tag">MRR TELEMETRY</span>
          <span className="art-badge-live">
            <i className="pulse-dot" /> Live
          </span>
        </div>
        <div className="art-val-row">
          <span className="art-big-num">$48,650</span>
          <span className="art-growth-pill">+32.4%</span>
        </div>
        <div className="art-chart-wrap">
          <svg viewBox="0 0 200 45" fill="none">
            <defs>
              <linearGradient id="saasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#164df4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#164df4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0 38 Q 30 32, 60 26 T 120 18 T 160 10 T 200 4 L 200 45 L 0 45 Z"
              fill="url(#saasGrad)"
            />
            <path
              className="art-line-draw"
              d="M0 38 Q 30 32, 60 26 T 120 18 T 160 10 T 200 4"
              stroke="#164df4"
              strokeWidth="2.5"
              fill="none"
            />
          </svg>
        </div>
        <div className="art-footer-chips">
          <span className="art-mini-chip">Active Users: 1,842</span>
          <span className="art-mini-chip">99.98% Uptime</span>
        </div>
      </div>
    </div>
  );
}

/** 02: E-Commerce - Product Card & 1-Click Checkout Flow */
function EcommerceArt() {
  return (
    <div className="art-card art-ecommerce">
      <div className="art-shop-card">
        <div className="art-shop-badge">
          <span>STOREFRONT</span>
          <span className="art-stock-tag">In Stock • 8 left</span>
        </div>
        <div className="art-product-preview">
          <div className="art-item-graphic">
            <svg viewBox="0 0 70 70" fill="none">
              <rect
                x="15"
                y="15"
                width="40"
                height="40"
                rx="8"
                fill="#164df4"
                fillOpacity="0.1"
                stroke="#164df4"
                strokeWidth="1.5"
              />
              <path
                d="M26 26H44V44H26Z"
                stroke="#164df4"
                strokeWidth="1.5"
                strokeDasharray="2 3"
              />
              <circle cx="35" cy="35" r="4" fill="#164df4" />
            </svg>
          </div>
          <div className="art-product-info">
            <span className="art-product-title">Studio Minimalist Watch</span>
            <span className="art-product-price">$280.00 USD</span>
          </div>
        </div>

        <div className="art-checkout-strip">
          <div className="art-cart-action">
            <span>Instant Checkout</span>
            <span className="art-arrow">→</span>
          </div>
          <span className="art-order-pill">Order #8491 • Dispatched</span>
        </div>
      </div>
    </div>
  );
}

/** 03: Healthcare - ECG Telemetry & Patient Scheduling */
function HealthcareArt() {
  return (
    <div className="art-card art-healthcare">
      <div className="art-clinic-card">
        <div className="art-card-top">
          <span className="art-pill-tag">PATIENT CARE PORTAL</span>
          <span className="art-secure-badge">
            🔒 Illustrative health workflow
          </span>
        </div>

        <div className="art-ecg-container">
          <svg viewBox="0 0 240 50" fill="none">
            <path
              d="M0 25 L 50 25 L 60 10 L 70 40 L 80 5 L 90 35 L 100 25 L 160 25 L 170 12 L 180 38 L 190 25 L 240 25"
              stroke="#164df4"
              strokeWidth="2"
              fill="none"
              className="art-ecg-line"
            />
          </svg>
        </div>

        <div className="art-vitals-row">
          <div className="art-vital-box">
            <span className="art-vital-lbl">HEART RATE</span>
            <span className="art-vital-val">72 bpm</span>
          </div>
          <div className="art-vital-box">
            <span className="art-vital-lbl">OXYGEN</span>
            <span className="art-vital-val">99%</span>
          </div>
        </div>

        <div className="art-schedule-pill">
          <span>Dr. Sarah Vance • 10:30 AM Confirmed</span>
        </div>
      </div>
    </div>
  );
}

/** 04: Education - Course Mastery Ring & Learning Journey */
function EducationArt() {
  return (
    <div className="art-card art-education">
      <div className="art-edu-card">
        <div className="art-card-top">
          <span className="art-pill-tag">CURRICULUM MASTERY</span>
          <span className="art-streak-badge">🔥 14-day streak</span>
        </div>

        <div className="art-progress-module">
          <div className="art-ring-wrap">
            <svg viewBox="0 0 70 70">
              <circle
                cx="35"
                cy="35"
                r="28"
                stroke="#164df420"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="35"
                cy="35"
                r="28"
                stroke="#164df4"
                strokeWidth="6"
                strokeDasharray="176"
                strokeDashoffset="28"
                strokeLinecap="round"
                fill="none"
                className="art-progress-ring"
              />
              <text
                x="35"
                y="40"
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="#164df4"
              >
                84%
              </text>
            </svg>
          </div>
          <div className="art-module-text">
            <span className="art-mod-name">Module 04: AI & Systems</span>
            <span className="art-mod-sub">6 of 8 lessons completed</span>
          </div>
        </div>

        <div className="art-edu-steps">
          <span className="art-step-tag done">01 Fundamentals ✓</span>
          <span className="art-step-tag done">02 Workflows ✓</span>
          <span className="art-step-tag current">03 Practice ⏱</span>
        </div>
      </div>
    </div>
  );
}

/** 05: Real Estate - Residence Wireframe & Viewing Booking */
function RealEstateArt() {
  return (
    <div className="art-card art-realestate">
      <div className="art-property-card">
        <div className="art-card-top">
          <span className="art-pill-tag">PROPERTY SHOWCASE</span>
          <span className="art-prime-tag">Featured</span>
        </div>

        <div className="art-iso-blueprint">
          <svg viewBox="0 0 200 70" fill="none">
            <path
              d="M100 8 L 180 32 L 100 56 L 20 32 Z"
              stroke="#164df4"
              strokeWidth="1.5"
              fill="#164df408"
            />
            <path
              d="M100 56 L 100 68 M 20 32 L 20 44 M 180 32 L 180 44"
              stroke="#164df4"
              strokeWidth="1.2"
            />
            <path
              d="M20 44 L 100 68 L 180 44"
              stroke="#164df4"
              strokeWidth="1.5"
            />
            <circle cx="100" cy="32" r="3" fill="#164df4" />
          </svg>
        </div>

        <div className="art-property-details">
          <div className="art-prop-title">The Horizon Residence</div>
          <div className="art-prop-specs">$1,650,000 • 3 Bed • 2,400 sq.ft</div>
        </div>

        <div className="art-viewing-action">
          <span>Private Viewing • Booked 2:00 PM</span>
        </div>
      </div>
    </div>
  );
}

/** 06: Professional Services - Client Agreement & Milestone Pipeline */
function ServicesArt() {
  return (
    <div className="art-card art-services">
      <div className="art-pro-card">
        <div className="art-card-top">
          <span className="art-pill-tag">CLIENT ENGAGEMENT</span>
          <span className="art-signed-badge">✓ Agreement Signed</span>
        </div>

        <div className="art-workflow-stages">
          <div className="art-stage-item done">
            <span className="art-stage-dot">✓</span>
            <span className="art-stage-title">Discovery</span>
          </div>
          <div className="art-stage-line done" />
          <div className="art-stage-item done">
            <span className="art-stage-dot">✓</span>
            <span className="art-stage-title">Architecture</span>
          </div>
          <div className="art-stage-line active" />
          <div className="art-stage-item current">
            <span className="art-stage-dot active">●</span>
            <span className="art-stage-title">Sprint 01</span>
          </div>
        </div>

        <div className="art-client-pill">
          <span>Shared Client Workspace • 12 Active Deliverables</span>
        </div>
      </div>
    </div>
  );
}

/** 07: Logistics - Shipment Dispatch Telemetry & Transit Hub */
function LogisticsArt() {
  return (
    <div className="art-card art-logistics">
      <div className="art-logistics-card">
        <div className="art-card-top">
          <span className="art-pill-tag">DISPATCH & FLEET RADAR</span>
          <span className="art-ontime-badge">● On Schedule</span>
        </div>

        <div className="art-route-visual">
          <svg viewBox="0 0 220 50" fill="none">
            <path
              d="M20 25 L 90 25 L 140 15 L 200 35"
              stroke="#164df4"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <circle cx="20" cy="25" r="5" fill="#164df4" />
            <circle cx="90" cy="25" r="4" fill="#164df4" />
            <circle cx="140" cy="15" r="4" fill="#164df4" />
            <circle
              cx="200"
              cy="35"
              r="6"
              fill="#164df4"
              className="art-pulsing-node"
            />
          </svg>
        </div>

        <div className="art-shipment-meta">
          <div className="art-meta-col">
            <span className="art-meta-lbl">ROUTE ID</span>
            <span className="art-meta-val">VNZ-8402</span>
          </div>
          <div className="art-meta-col">
            <span className="art-meta-lbl">EST. ARRIVAL</span>
            <span className="art-meta-val">15:45 Today</span>
          </div>
        </div>

        <div className="art-warehouse-sync">
          <span>Zero Inventory Delay • Hub Rebalanced</span>
        </div>
      </div>
    </div>
  );
}

/** 08: Your Next Big Idea - Innovation Matrix & Rapid Prototype Blueprint */
function BigIdeaArt() {
  return (
    <div className="art-card art-bigidea">
      <div className="art-lab-card">
        <div className="art-card-top">
          <span className="art-pill-tag">INNOVATION LAB</span>
          <span className="art-prototype-tag">✨ Prototype Ready</span>
        </div>

        <div className="art-idea-constellation">
          <svg viewBox="0 0 200 70" fill="none">
            <circle
              cx="100"
              cy="35"
              r="28"
              stroke="#164df430"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx="100"
              cy="35"
              r="8"
              fill="#164df4"
              className="art-core-pulse"
            />
            <path
              d="M100 35 L 50 15 M 100 35 L 150 15 M 100 35 L 70 55 M 100 35 L 130 55"
              stroke="#164df4"
              strokeWidth="1.2"
              strokeOpacity="0.4"
            />
            <circle cx="50" cy="15" r="4" fill="#164df4" />
            <circle cx="150" cy="15" r="4" fill="#164df4" />
            <circle cx="70" cy="55" r="4" fill="#164df4" />
            <circle cx="130" cy="55" r="4" fill="#164df4" />
          </svg>
        </div>

        <div className="art-idea-label">
          <span>Concept Validation ➔ High-Impact MVP</span>
        </div>

        <div className="art-idea-footer">
          <span className="art-spark-tag">Strategy + Design + AI Core</span>
        </div>
      </div>
    </div>
  );
}
