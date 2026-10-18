import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const dir = "artifacts/production";
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({
  ...(process.env.PLAYWRIGHT_CHROMIUM_CHANNEL
    ? { channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL }
    : process.platform === "win32"
      ? { channel: "chrome" }
      : {}),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const checks = [];
const accessibility = [];
const serviceSlugs = [
  "web-development",
  "web-applications",
  "mobile-app-development",
  "ai-automation",
  "saas-product-development",
  "digital-marketing",
  "seo",
  "answer-engine-optimization",
];
const routes = [
  "/",
  "/about",
  "/blog",
  "/contact",
  "/case-studies",
  "/services",
  ...serviceSlugs.map((slug) => `/services/${slug}`),
  "/scope",
  "/simulator",
  "/playbook",
  "/tools",
  "/careers",
  "/privacy",
  "/terms",
];
const titles = new Set();
try {
  for (const route of routes) {
    const response = await page.goto(base + route, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200, route);
    await page.locator("h1").waitFor({ state: "visible" });
    const title = await page.title();
    assert.ok(!titles.has(title), `Unique title: ${route}`);
    titles.add(title);
    assert.ok(
      (await page.locator('meta[name="description"]').getAttribute("content"))
        ?.length > 50,
      route,
    );
    assert.equal(
      new URL(await page.locator('link[rel="canonical"]').getAttribute("href"))
        .pathname,
      route,
    );
    assert.equal(
      new URL(
        await page.locator('meta[property="og:url"]').getAttribute("content"),
      ).pathname,
      route,
    );
    assert.ok(
      (
        await page.locator('meta[property="og:image"]').getAttribute("content")
      ).includes("/og?path="),
    );
    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    schemas.forEach((value) => JSON.parse(value));
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Desktop overflow: ${route}`,
    );
    if (route.startsWith("/services/"))
      assert.equal(await page.locator("details.faq-item").count(), 4);
    if (
      [
        "/",
        "/blog",
        "/contact",
        "/services/web-development",
        "/case-studies",
      ].includes(route)
    ) {
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      accessibility.push({
        route,
        violations: result.violations.map(({ id, impact, nodes }) => ({
          id,
          impact,
          nodes: nodes.map(({ target, failureSummary }) => ({
            target,
            failureSummary,
          })),
        })),
      });
    }
    checks.push(`Page, metadata and desktop layout: ${route}`);
  }

  await page.goto(base + "/", { waitUntil: "networkidle" });
  const sections = await page
    .locator(".studio-site > main > section")
    .evaluateAll((els) =>
      els.map((el) => ({
        name: el.id || el.className,
        height: el.getBoundingClientRect().height,
        background: getComputedStyle(el).backgroundColor,
      })),
    );
  assert.ok(
    sections.every((item) => item.height >= 999),
    JSON.stringify(sections),
  );
  assert.equal(await page.locator(".engineering-panel").count(), 4);
  assert.equal(
    await page.locator(".terminal-typing-box,.stacking-card-inner").count(),
    0,
  );
  assert.equal(await page.locator(".footer-shader").count(), 1);
  assert.ok(
    !/OmniFlow|PulseAI|120,000 RPS|100% E2E Verified|Verified Telemetry/.test(
      await page.locator("body").innerText(),
    ),
  );
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(200);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Home overflow ${width}`,
    );
    if ([1440, 390].includes(width))
      await page.screenshot({ path: `${dir}/home-${width}.png` });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: /^Services/ })
    .click();
  await page.waitForURL("**/services");
  checks.push(
    "Landing sections occupy at least one viewport; light chapters; mobile navigation works",
  );

  for (const route of [
    "/blog",
    "/contact",
    "/services/web-development",
    "/case-studies",
    "/scope",
    "/simulator",
    "/about",
  ]) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${route} overflow ${width}`,
      );
      if (
        width === 390 &&
        ["/blog", "/contact", "/services/web-development"].includes(route)
      )
        await page.screenshot({
          path: `${dir}/${route.replaceAll("/", "-")}-mobile.png`,
        });
    }
  }
  checks.push("No page overflow at 320, 390 and 768px on the primary journeys");

  await page.goto(base + "/blog?q=PostgreSQL", { waitUntil: "networkidle" });
  assert.equal(
    await page.getByRole("searchbox", { name: "Search articles" }).inputValue(),
    "PostgreSQL",
  );
  await page.getByRole("searchbox").fill("no-such-topic-987654");
  await page
    .getByRole("heading", { name: "No field notes here yet." })
    .waitFor();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  assert.equal(await page.locator(".journal-article").count(), 12);
  await page.getByRole("button", { name: "Databases", exact: true }).click();
  assert.ok((await page.locator(".journal-article").count()) > 0);
  assert.ok(
    (
      await page
        .locator(".journal-article-copy > .section-kicker")
        .allTextContents()
    ).every((topic) => topic === "Databases"),
  );
  await page.getByRole("button", { name: "All", exact: true }).click();
  const blogLinks = await page
    .locator('.journal-article a[href^="/blog/"]')
    .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  for (const route of blogLinks) {
    const response = await page.goto(base + route, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator(".blog-diagram-card").count(), 1);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      route,
    );
  }
  checks.push(
    "Blog search, URL query, filters, empty state and all 12 article diagrams work",
  );

  await page.goto(base + "/scope", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Continue to Capabilities" }).click();
  await page.getByRole("button", { name: "Continue to Scale & SLA" }).click();
  await page.getByRole("button", { name: "Review Scoping Brief" }).click();
  await page
    .getByRole("heading", { name: "Your indicative project outline" })
    .waitFor();
  assert.equal(
    await page.locator('input[name="email"]:visible').count(),
    0,
    "Result appears before contact collection",
  );
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download your report" }).click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), "venizor-scope-report.txt");
  await page.goto(base + "/simulator", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Dispatch HTTPS Mutation" }).click();
  await page.getByRole("button", { name: "Download your report" }).waitFor();
  checks.push(
    "Scope result and downloadable report are ungated; simulator offers its report after a run",
  );

  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator(".header-contact").click();
  await page.getByRole("dialog").waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .locator(".header-contact")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  const serviceButton = page.locator(".service-row-heading").first();
  const initiallyExpanded = await serviceButton.getAttribute("aria-expanded");
  await serviceButton.focus();
  await page.keyboard.press("Enter");
  assert.notEqual(
    await serviceButton.getAttribute("aria-expanded"),
    initiallyExpanded,
  );
  checks.push(
    "Dialog closes with Escape and restores focus; service accordion works from the keyboard",
  );

  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await page.locator('input[name="email"]').fill("invalid");
  assert.equal(
    await page
      .locator('input[name="email"]')
      .evaluate((el) => el.checkValidity()),
    false,
  );
  await page.getByRole("button", { name: "Email this brief" }).waitFor();
  const badLead = await page.request.post(base + "/api/contact", {
    data: { email: "invalid" },
  });
  assert.equal(badLead.status(), 400);
  const validLead = await page.request.post(base + "/api/contact", {
    data: {
      requestId: crypto.randomUUID(),
      name: "Test User",
      email: "test@example.com",
      service: "Web development",
      message: "A local validation check without live email.",
    },
  });
  assert.equal(validLead.status(), 503);
  const cron = await page.request.get(base + "/api/cron/leads");
  assert.equal(cron.status(), 401);
  const health1 = await page.request.get(base + "/api/health");
  assert.equal(health1.status(), 200);
  assert.equal((await health1.json()).status, "ok");
  assert.match(health1.headers()["cache-control"], /no-store/);
  checks.push(
    "Contact validation works; disabled delivery returns 503; cron rejects unauthorized calls; health is live and uncached",
  );

  const sitemap = await (await page.request.get(base + "/sitemap.xml")).text();
  for (const route of [...routes, ...blogLinks])
    assert.ok(
      sitemap.includes(route === "/" ? "https://venizor.com" : route),
      `Sitemap ${route}`,
    );
  const image = await page.request.get(base + "/og?path=%2Fblog");
  assert.equal(image.status(), 200);
  const bytes = await image.body();
  assert.equal(bytes.readUInt32BE(16), 1200);
  assert.equal(bytes.readUInt32BE(20), 630);
  const headers = (await page.request.get(base + "/")).headers();
  for (const name of [
    "x-content-type-options",
    "referrer-policy",
    "x-frame-options",
    "permissions-policy",
    "strict-transport-security",
    "content-security-policy-report-only",
  ])
    assert.ok(headers[name], name);
  checks.push(
    "Sitemap covers all pages; share images are 1200×630; security headers are present",
  );

  const motionContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(base + "/blog", { waitUntil: "networkidle" });
  const route = motionPage.locator(".art-route").first();
  const first = await route.evaluate(
    (el) => getComputedStyle(el).strokeDashoffset,
  );
  await motionPage.waitForTimeout(400);
  assert.notEqual(
    await route.evaluate((el) => getComputedStyle(el).strokeDashoffset),
    first,
  );
  await motionPage.getByRole("button", { name: "Pause illustrations" }).click();
  assert.equal(
    await route.evaluate((el) => getComputedStyle(el).animationPlayState),
    "paused",
  );
  await motionPage.screenshot({ path: `${dir}/blog-desktop.png` });
  await motionContext.close();
  checks.push(
    "Blog illustrations animate and pause; reduced-motion rendering also checked",
  );
  assert.deepEqual(errors, []);
  const serious = accessibility.flatMap((item) =>
    item.violations
      .filter((violation) => ["serious", "critical"].includes(violation.impact))
      .map((violation) => ({ route: item.route, ...violation })),
  );
  await writeFile(
    `${dir}/verification.json`,
    JSON.stringify({ checks, accessibility, serious, errors }, null, 2),
  );
  assert.deepEqual(
    serious,
    [],
    "Serious accessibility violations; see verification.json",
  );
  console.log(
    `Passed ${checks.length} browser checks. Screenshots and accessibility findings: ${dir}/`,
  );
} finally {
  await writeFile(
    `${dir}/verification-progress.json`,
    JSON.stringify({ checks, accessibility, errors }, null, 2),
  );
  await browser.close();
}
