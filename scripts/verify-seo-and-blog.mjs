import { chromium } from "@playwright/test";
import assert from "node:assert/strict";

const outDir = "C:/Users/lk645/.gemini/antigravity-ide/brain/0a702780-31fc-4616-b669-0023f407c159";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];

try {
  // 1. Verify robots.txt
  console.log("Checking /robots.txt...");
  const pageRobots = await browser.newPage();
  const resRobots = await pageRobots.goto("http://localhost:3000/robots.txt");
  assert.equal(resRobots.status(), 200);
  const textRobots = await resRobots.text();
  assert.ok(textRobots.includes("User-Agent: *"));
  assert.ok(textRobots.includes("GPTBot"));
  assert.ok(textRobots.includes("sitemap.xml"));
  await pageRobots.close();

  // 2. Verify sitemap.xml
  console.log("Checking /sitemap.xml...");
  const pageSitemap = await browser.newPage();
  const resSitemap = await pageSitemap.goto("http://localhost:3000/sitemap.xml");
  assert.equal(resSitemap.status(), 200);
  const textSitemap = await resSitemap.text();
  assert.ok(textSitemap.includes("/blog"));
  assert.ok(textSitemap.includes("/about"));
  assert.ok(textSitemap.includes("/contact"));
  assert.ok(textSitemap.includes("connecting-third-party-https-apis"));
  await pageSitemap.close();

  // 3. Verify llms.txt & llms-full.txt
  console.log("Checking /llms.txt and /llms-full.txt...");
  const pageLlms = await browser.newPage();
  const resLlms = await pageLlms.goto("http://localhost:3000/llms.txt");
  assert.equal(resLlms.status(), 200);
  const textLlms = await resLlms.text();
  assert.ok(textLlms.includes("VENIZOR"));
  assert.ok(textLlms.includes("Third-Party HTTPS Integrations"));

  const resLlmsFull = await pageLlms.goto("http://localhost:3000/llms-full.txt");
  assert.equal(resLlmsFull.status(), 200);
  await pageLlms.close();

  // 4. Verify /blog Index Page
  console.log("Checking /blog index page...");
  const pageBlog = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pageBlog.on("pageerror", (err) => errors.push(`/blog error: ${err.message}`));
  pageBlog.on("console", (msg) => {
    if (msg.type() === "error" && /hydrat|server rendered|uncaught/i.test(msg.text())) {
      errors.push(`/blog console: ${msg.text()}`);
    }
  });

  const resBlog = await pageBlog.goto("http://localhost:3000/blog", { waitUntil: "networkidle" });
  assert.equal(resBlog.status(), 200);

  const titleBlog = await pageBlog.title();
  assert.ok(titleBlog.includes("VENIZOR"), "Title contains VENIZOR");

  // Check JSON-LD in head
  const jsonLdCount = await pageBlog.locator('script[type="application/ld+json"]').count();
  assert.ok(jsonLdCount >= 3, `Expected at least 3 json-ld scripts, found ${jsonLdCount}`);

  // Test interactive category filter
  const apiPill = pageBlog.locator(".blog-cat-pill", { hasText: "APIs & Integrations" });
  await apiPill.click();
  await pageBlog.waitForTimeout(300);
  assert.equal(await pageBlog.locator(".article-card").count(), 1);

  // Reset to All
  const allPill = pageBlog.locator(".blog-cat-pill", { hasText: "All" });
  await allPill.click();
  await pageBlog.waitForTimeout(300);
  assert.equal(await pageBlog.locator(".article-card").count(), 6);

  // Test live search filter
  const searchInput = pageBlog.locator(".blog-search-input");
  await searchInput.fill("PostgreSQL");
  await pageBlog.waitForTimeout(300);
  assert.equal(await pageBlog.locator(".article-card").count(), 1);

  await searchInput.fill("");
  await pageBlog.waitForTimeout(200);

  // Capture desktop and mobile screenshots
  await pageBlog.screenshot({ path: `${outDir}/page-blog-desktop.png`, fullPage: true });
  await pageBlog.setViewportSize({ width: 390, height: 844 });
  await pageBlog.screenshot({ path: `${outDir}/page-blog-mobile.png`, fullPage: true });
  await pageBlog.close();

  // 5. Verify Single Article Page
  console.log("Checking /blog/connecting-third-party-https-apis...");
  const pageArticle = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pageArticle.on("pageerror", (err) => errors.push(`Article error: ${err.message}`));
  pageArticle.on("console", (msg) => {
    if (msg.type() === "error" && /hydrat|server rendered|uncaught/i.test(msg.text())) {
      errors.push(`Article console: ${msg.text()}`);
    }
  });

  const resArticle = await pageArticle.goto(
    "http://localhost:3000/blog/connecting-third-party-https-apis",
    { waitUntil: "networkidle" }
  );
  assert.equal(resArticle.status(), 200);

  const articleH1 = await pageArticle.locator("h1").textContent();
  assert.ok(articleH1.includes("Connecting Third-Party HTTPS APIs"));

  // Check code block and takeaways
  assert.equal(await pageArticle.locator(".takeaways-callout").count(), 1);
  assert.equal(await pageArticle.locator(".article-code-block").count(), 1);

  await pageArticle.screenshot({ path: `${outDir}/page-article-desktop.png`, fullPage: true });
  await pageArticle.close();

  // 6. Verify /insights redirect
  console.log("Checking /insights redirect...");
  const pageInsights = await browser.newPage();
  await pageInsights.goto("http://localhost:3000/insights", { waitUntil: "networkidle" });
  assert.ok(pageInsights.url().includes("/blog"), `Expected /insights to redirect to /blog, got ${pageInsights.url()}`);
  await pageInsights.close();

  assert.deepEqual(errors, []);
  console.log("All SEO, AEO, GEO, AIO, SXO, and Blog verifications passed with 0 errors!");
} finally {
  await browser.close();
}
