"use client";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "./experience";

const layers = [
  {
    number: "01",
    label: "FOUNDATION",
    title: "Confidence starts at the edges.",
    text: "A clear boundary between your application and the outside world. We plan authentication, permissions and failure handling around the way your system is actually used.",
    items: [
      "Explicit access boundaries",
      "Input validation and rate limits",
      "Observable failure and recovery",
    ],
    nodes: ["REQUEST", "VALIDATE", "AUTHORIZE", "APPLICATION"],
    href: "/services/web-applications",
    action: "Explore web applications",
  },
  {
    number: "02",
    label: "CONNECTED DATA",
    title: "The right information. In the right place.",
    text: "Useful products depend on a considered data model. We choose storage, search and integration patterns that make information easier to trust, maintain and find.",
    items: [
      "Data models shaped by real workflows",
      "Search and retrieval where useful",
      "Measured queries and workload testing",
    ],
    nodes: ["CAPTURE", "MODEL", "CONNECT", "RETRIEVE"],
    href: "/playbook",
    action: "Explore the stack playbook",
  },
  {
    number: "03",
    label: "PRACTICAL INTELLIGENCE",
    title: "Make room for better work.",
    text: "AI should earn its place in a workflow. Start with a defined task, evaluate representative examples and keep a person involved wherever judgment matters.",
    items: [
      "Clear task and evaluation criteria",
      "Bounded tools and permission checks",
      "Review, correction and human approval",
    ],
    nodes: ["CONTEXT", "RETRIEVE", "PROPOSE", "REVIEW"],
    href: "/services/ai-automation",
    action: "Explore AI & automation",
  },
  {
    number: "04",
    label: "CONTINUOUS DELIVERY",
    title: "Ship carefully. Keep learning.",
    text: "A release is the start of operating a product. We plan automated checks, visibility and recovery so your team can understand changes and respond when something needs attention.",
    items: [
      "Reviewable builds and release checks",
      "Monitoring tied to user journeys",
      "Documented rollback and handover",
    ],
    nodes: ["BUILD", "VERIFY", "RELEASE", "OBSERVE"],
    href: "/case-studies",
    action: "Explore architecture scenarios",
  },
];
export function StickyStackingSection() {
  return (
    <section className="engineering-section" aria-labelledby="stacking-heading">
      <div className="page-container engineering-heading">
        <span className="section-kicker">THE THINKING BEHIND THE BUILD</span>
        <h2 id="stacking-heading">
          Good engineering.
          <br />
          <span>Layer by layer.</span>
        </h2>
        <p>
          Four connected considerations. One product designed to work in the
          real world.
        </p>
      </div>
      <div className="engineering-track">
        {layers.map((layer) => (
          <article className="engineering-panel" key={layer.number}>
            <div className="page-container engineering-panel-grid">
              <div className="engineering-panel-copy">
                <span className="section-kicker">
                  {layer.number} / {layer.label}
                </span>
                <Reveal>
                  <h3>{layer.title}</h3>
                  <p>{layer.text}</p>
                </Reveal>
                <ul>
                  {layer.items.map((item) => (
                    <li key={item}>
                      <ArrowDownRight size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={layer.href} className="text-link">
                  {layer.action}
                  <ArrowUpRight size={19} />
                </Link>
              </div>
              <div className="engineering-drawing" aria-hidden="true">
                <span className="engineering-layer-number">{layer.number}</span>
                <div className="engineering-node-track">
                  {layer.nodes.map((node, i) => (
                    <div className="engineering-node" key={node}>
                      <span>0{i + 1}</span>
                      <strong>{node}</strong>
                      <i />
                    </div>
                  ))}
                </div>
                <span className="drawing-caption">
                  VENIZOR / DESIGN APPROACH / {layer.label}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
