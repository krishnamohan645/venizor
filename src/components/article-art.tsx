import { SectionIllustration, type ArtworkKind } from "./section-illustration";
const topics: Record<string, { label: string; kind: ArtworkKind }> = {
  "APIs & Integrations": { label: "CONNECTED SYSTEMS", kind: "connections" },
  "AI & Automation": { label: "APPLIED INTELLIGENCE", kind: "intelligence" },
  Databases: { label: "STRUCTURE & SCALE", kind: "data" },
  "Cloud & DevOps": { label: "CONTINUOUS DELIVERY", kind: "delivery" },
  Security: { label: "CONSIDERED BOUNDARIES", kind: "security" },
  "Digital Marketing & SXO": { label: "DISCOVERY & GROWTH", kind: "discovery" },
};
export function ArticleArt({ category }: { category: string }) {
  const topic = topics[category] || topics["APIs & Integrations"];
  return (
    <div
      className={`article-art editorial-cover cover-${topic.kind}`}
      aria-hidden="true"
    >
      <div className="editorial-cover-frame">
        <SectionIllustration kind={topic.kind} />
      </div>
      <div className="editorial-cover-meta">
        <span>{topic.label}</span>
        <span>V / FIELD NOTES</span>
      </div>
    </div>
  );
}
