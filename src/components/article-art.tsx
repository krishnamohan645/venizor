const topics: Record<string, { name: string; kind: string; symbol: string }> = {
  "APIs & Integrations": {
    name: "CONNECTED SYSTEMS",
    kind: "connections",
    symbol: "/",
  },
  "AI & Automation": {
    name: "APPLIED INTELLIGENCE",
    kind: "intelligence",
    symbol: "+",
  },
  Databases: { name: "STRUCTURE & SCALE", kind: "data", symbol: "=" },
  "Cloud & DevOps": {
    name: "CONTINUOUS DELIVERY",
    kind: "delivery",
    symbol: "↗",
  },
  Security: { name: "CONSIDERED BOUNDARIES", kind: "security", symbol: "[ ]" },
  "Digital Marketing & SXO": {
    name: "DISCOVERY & GROWTH",
    kind: "discovery",
    symbol: "*",
  },
};
export function ArticleArt({ category }: { category: string }) {
  const topic = topics[category] || topics["APIs & Integrations"];
  return (
    <div
      className={`article-art editorial-cover cover-${topic.kind}`}
      aria-hidden="true"
    >
      <div className="editorial-cover-frame">
        <svg viewBox="0 0 600 360" fill="none">
          <path
            className="cover-baseline"
            d="M50 295H550M50 65H550M80 40V320M520 40V320"
          />
          {topic.kind === "connections" &&
            Array.from({ length: 15 }, (_, i) => (
              <path
                key={i}
                className="cover-line art-route"
                d={`M${65 + i * 5} 270C${170 + i * 5} ${270 - i * 7} ${310 - i * 3} ${50 + i * 3} ${530 - i * 5} 90`}
              />
            ))}
          {topic.kind === "intelligence" &&
            Array.from({ length: 16 }, (_, i) => (
              <ellipse
                key={i}
                className="cover-line"
                cx="300"
                cy="180"
                rx={35 + i * 9}
                ry={115 - i * 4}
                transform={`rotate(${i * 11.25} 300 180)`}
              />
            ))}
          {topic.kind === "data" &&
            Array.from({ length: 14 }, (_, i) => (
              <path
                key={i}
                className="cover-line"
                d={`M${110 + i * 8} ${70 + i * 8}L${420 + i * 4} ${70 + i * 8}L${490 - i * 3} ${250 + i * 2}L${180 - i * 4} ${250 + i * 2}Z`}
              />
            ))}
          {topic.kind === "delivery" &&
            Array.from({ length: 19 }, (_, i) => (
              <path
                key={i}
                className="cover-line art-route"
                d={`M${70 + i * 9} 290L${230 + i * 10} 70L${390 + i * 6} 290`}
              />
            ))}
          {topic.kind === "security" &&
            Array.from({ length: 15 }, (_, i) => (
              <rect
                key={i}
                className="cover-line"
                x={130 + i * 8}
                y={50 + i * 7}
                width={340 - i * 16}
                height={260 - i * 14}
                rx={7 + i * 2}
              />
            ))}
          {topic.kind === "discovery" &&
            Array.from({ length: 17 }, (_, i) => (
              <path
                key={i}
                className="cover-line"
                d={`M70 ${280 - i * 7}C${130 + i * 6} ${310 - i * 3} ${310 - i * 5} ${40 + i * 10} 530 ${60 + i * 9}`}
              />
            ))}
        </svg>
        <span className="editorial-cover-symbol">{topic.symbol}</span>
      </div>
      <div className="editorial-cover-meta">
        <span>{topic.name}</span>
        <span>V / FIELD NOTES</span>
      </div>
    </div>
  );
}
