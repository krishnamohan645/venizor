export type SearchEntry = {
  href: string;
  title: string;
  description: string;
  kind: "Page" | "Service" | "Article" | "Home section";
  keywords: string;
};

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Match every word, then favor titles over supporting content. */
export function searchEntries(
  entries: SearchEntry[],
  query: string,
): SearchEntry[] {
  const phrase = normalize(query);
  if (!phrase) return entries;
  const words = [...new Set(phrase.split(" "))];
  return entries
    .map((entry, position) => {
      const title = normalize(entry.title);
      const text = normalize(
        `${entry.title} ${entry.description} ${entry.keywords}`,
      );
      const score = words.every((word) => text.includes(word))
        ? (title === phrase ? 100 : title.includes(phrase) ? 50 : 0) +
          words.reduce((sum, word) => sum + (title.includes(word) ? 10 : 1), 0)
        : 0;
      return { entry, score, position };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.position - b.position)
    .map(({ entry }) => entry);
}
