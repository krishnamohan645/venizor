import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const errors = [];

page.on("pageerror", (err) => errors.push(`Page error: ${err.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") {
    errors.push(`Console error: ${msg.text()}`);
  }
});

console.log("1. Verifying /careers page...");
await page.goto("http://localhost:3000/careers", { waitUntil: "networkidle" });
assert.equal(await page.locator("h1.careers-main-headline").count(), 1, "Careers headline must exist");
assert.equal(await page.locator(".role-card").count(), 4, "Must render 4 open role cards");

// Verify filtering
await page.locator(".careers-dept-pill", { hasText: "Applied AI" }).click();
await page.waitForTimeout(300);
assert.equal(await page.locator(".role-card").count(), 1, "Applied AI filter must return 1 role");
assert.ok((await page.locator(".role-card-title").first().textContent()).includes("AI Reasoning"));

// Test modal drawer
await page.locator(".role-apply-btn").first().click();
await page.waitForTimeout(300);
assert.equal(await page.locator(".role-modal-container").count(), 1, "Role modal must open");
await page.locator(".role-modal-close").click();
await page.waitForTimeout(300);
assert.equal(await page.locator(".role-modal-container").count(), 0, "Role modal must close");

// Check JSON-LD
const jsonLdContent = await page.locator('script[type="application/ld+json"]').allTextContents();
const hasJobPosting = jsonLdContent.some((txt) => txt.includes('"@type":"JobPosting"'));
assert.ok(hasJobPosting, "Careers page must contain JobPosting JSON-LD schemas");

console.log("2. Verifying New Blog Posts with Custom Diagrams & Dev.to Features...");
const testSlugs = [
  "the-race-to-superintelligence-asi-hardware-frontiers",
  "how-ai-is-evolving-agentic-reasoning-loops",
  "how-big-tech-engineers-hyper-scale-apps",
  "securing-ai-production-systems",
  "solving-the-distributed-dual-write-problem",
  "how-applications-are-built-in-this-era",
];

for (const slug of testSlugs) {
  await page.goto(`http://localhost:3000/blog/${slug}`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("h1.article-main-title").count(), 1, `Title must exist for ${slug}`);
  assert.equal(await page.locator(".blog-diagram-card svg.diagram-svg").count(), 1, `Diagram must exist for ${slug}`);
  assert.equal(await page.locator(".reading-progress-track").count(), 1, "Reading progress bar must exist");
  assert.equal(await page.locator(".dev-reaction-dock").count(), 1, "Dev reactions dock must exist");
  assert.equal(await page.locator(".article-toc").count(), 1, "Table of contents must exist");
}

console.log("3. Verifying Home Page Motion & 3D Components...");
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
assert.equal(await page.locator(".terminal-typing-box").count(), 1, "Terminal typing box must exist");
assert.equal(await page.locator(".circular-carousel-wrapper").count(), 1, "3D Circular carousel must exist");
assert.equal(await page.locator(".cylinder-card").count(), 6, "Must render 6 cards in 3D cylinder");
assert.equal(await page.locator(".sticky-stack-wrapper").count(), 1, "Sticky stacking section must exist");
assert.equal(await page.locator(".stacking-card-item").count(), 4, "Must render 4 stacking cards");

// Filter errors to ignore any third-party browser extensions
const criticalErrors = errors.filter(
  (e) => !e.includes("installHook") && !e.includes("chrome-extension")
);

if (criticalErrors.length > 0) {
  console.error("Critical runtime errors encountered:", criticalErrors);
  process.exit(1);
}

console.log("All Careers, 3D Motion, Sticky Stacking, and Dev.to Blog features PASSED with ZERO errors!");
await browser.close();
