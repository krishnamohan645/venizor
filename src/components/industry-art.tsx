"use client";

interface IndustryArtProps {
  selected: number;
}

export function IndustryArt({ selected }: IndustryArtProps) {
  return (
    <div
      className="industry-art-container industry-interface-art"
      key={selected}
      data-industry-art={selected}
    >
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

/** 01: Technology & SaaS - Illustrative Product Workspace & Node Mesh */
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
          <span className="art-pill-tag">PRODUCT WORKSPACE</span>
          <span className="art-badge-live">
            <i className="pulse-dot" /> Concept
          </span>
        </div>
        <div className="art-val-row">
          <span className="art-big-num">Connected work.</span>
          <span className="art-growth-pill">Overview</span>
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
          <span className="art-mini-chip">Onboarding</span>
          <span className="art-mini-chip">Billing & workflows</span>
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
          <span className="art-stock-tag">Product detail</span>
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
            <span className="art-product-title">Everyday collection</span>
            <span className="art-product-price">Product · Cart · Checkout</span>
          </div>
        </div>

        <div className="art-checkout-strip">
          <div className="art-cart-action">
            <span>Checkout preview</span>
            <span className="art-arrow">→</span>
          </div>
          <span className="art-order-pill">Order confirmation preview</span>
        </div>
      </div>
    </div>
  );
}

/** 03: Healthcare - Care Workflow & Appointment Preview */
function HealthcareArt() {
  return (
    <div className="art-card art-healthcare">
      <div className="art-clinic-card">
        <div className="art-card-top">
          <span className="art-pill-tag">CARE WORKSPACE</span>
          <span className="art-secure-badge">Care workflow</span>
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
            <span className="art-vital-lbl">BOOKING</span>
            <span className="art-vital-val">Scheduled</span>
          </div>
          <div className="art-vital-box">
            <span className="art-vital-lbl">FOLLOW-UP</span>
            <span className="art-vital-val">In review</span>
          </div>
        </div>

        <div className="art-schedule-pill">
          <span>Appointment · Example schedule</span>
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
          <span className="art-pill-tag">LEARNING WORKSPACE</span>
          <span className="art-streak-badge">Learning path</span>
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
                ✓
              </text>
            </svg>
          </div>
          <div className="art-module-text">
            <span className="art-mod-name">Explore your next lesson</span>
            <span className="art-mod-sub">A guided learning journey</span>
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
          <span className="art-prime-tag">Listing preview</span>
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
          <div className="art-prop-title">A place to call home.</div>
          <div className="art-prop-specs">
            Property details · Floor plans · Enquiries
          </div>
        </div>

        <div className="art-viewing-action">
          <span>Viewing enquiry preview</span>
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
          <span className="art-signed-badge">Project overview</span>
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
          <span>Shared workspace · Clear next steps</span>
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
          <span className="art-pill-tag">ROUTE WORKSPACE</span>
          <span className="art-ontime-badge">Route preview</span>
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
            <span className="art-meta-lbl">JOURNEY</span>
            <span className="art-meta-val">Pickup → Delivery</span>
          </div>
          <div className="art-meta-col">
            <span className="art-meta-lbl">NEXT STEP</span>
            <span className="art-meta-val">Status update</span>
          </div>
        </div>

        <div className="art-warehouse-sync">
          <span>Connected orders, inventory and dispatch</span>
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
          <span className="art-pill-tag">IDEA TO PROTOTYPE</span>
          <span className="art-prototype-tag">Concept sketch</span>
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
          <span>Explore. Sketch. Test.</span>
        </div>

        <div className="art-idea-footer">
          <span className="art-spark-tag">Strategy + Design + Engineering</span>
        </div>
      </div>
    </div>
  );
}
