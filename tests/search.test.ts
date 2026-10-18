import { describe, expect, it } from "vitest";
import { getSearchIndex } from "@/lib/search-index";
import { searchEntries } from "@/lib/search";
import { routeInfo } from "@/lib/site";
import { services } from "@/data/services";
import { blogPosts } from "@/data/blog-data";
import { GET } from "@/app/api/search/route";

describe("site search", () => {
  it("covers every public page, service and article with unique absolute local links", () => {
    const entries = getSearchIndex();
    const hrefs = entries.map((entry) => entry.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of [
      ...Object.keys(routeInfo),
      ...services.map((service) => `/services/${service.slug}`),
      ...blogPosts.map((post) => `/blog/${post.slug}`),
    ])
      expect(hrefs).toContain(href);
    expect(
      hrefs.every((href) => href.startsWith("/") && !href.startsWith("//")),
    ).toBe(true);
    expect(
      entries
        .filter((entry) => entry.kind === "Home section")
        .every((entry) => entry.href.startsWith("/#")),
    ).toBe(true);
  });

  it("includes newly published data without maintaining a separate navigation list", () => {
    blogPosts.push({
      ...blogPosts[0],
      slug: "new-search-test",
      title: "Newly published article",
    });
    try {
      expect(searchEntries(getSearchIndex(), "newly published")[0].href).toBe(
        "/blog/new-search-test",
      );
    } finally {
      blogPosts.pop();
    }
  });

  it("prioritizes exact and partial title matches over incidental mentions", () => {
    expect(searchEntries(getSearchIndex(), "Careers")[0].href).toBe("/careers");
    expect(searchEntries(getSearchIndex(), "Products")[0].href).toBe(
      "/#products",
    );
    expect(searchEntries(getSearchIndex(), "Playbook")[0].href).toBe(
      "/playbook",
    );
  });

  it("matches multiple words, mixed case and punctuation across metadata", () => {
    const results = searchEntries(getSearchIndex(), "  WEBHOOK, retries  ");
    expect(results.some((entry) => entry.href === "/case-studies")).toBe(true);
    expect(
      searchEntries(getSearchIndex(), "PostgreSQL").some(
        (entry) => entry.kind === "Article",
      ),
    ).toBe(true);
    expect(
      searchEntries(getSearchIndex(), "LLM calculator").some(
        (entry) => entry.href === "/tools",
      ),
    ).toBe(true);
  });

  it("returns useful destinations for every suggested search", () => {
    for (const query of [
      "Playbook",
      "Simulator",
      "Careers",
      "Tools",
      "Blog",
      "Scope",
    ]) {
      expect(searchEntries(getSearchIndex(), query).length).toBeGreaterThan(0);
    }
  });

  it("handles empty input and impossible queries without mutating the index", () => {
    const entries = getSearchIndex();
    const original = structuredClone(entries);
    expect(searchEntries(entries, " \n ")).toEqual(entries);
    expect(searchEntries(entries, "no-such-topic-987654")).toEqual([]);
    expect(entries).toEqual(original);
  });

  it("serves the current compact index without caching stale results", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect((await response.json()).entries).toEqual(getSearchIndex());
  });
});
