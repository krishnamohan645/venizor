import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const folder = "artifacts/error-recovery";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({
  ...(process.platform === "win32" ? { channel: "chrome" } : {}),
  headless: true,
});
const checks = [],
  accessibility = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await context.addInitScript(() => {
    const original = URLSearchParams.prototype.get;
    window.__pageFault = true;
    URLSearchParams.prototype.get = function (key) {
      if (window.__pageFault && location.pathname === "/blog" && key === "q")
        throw window.__stringFault
          ? "Private injected string failure"
          : new Error("Private injected rendering failure");
      return original.call(this, key);
    };
  });
  const page = await context.newPage();
  await page.goto(base + "/blog", { waitUntil: "networkidle" });
  const recovery = page.getByRole("heading", { name: /This page needs/ });
  await expect(recovery).toBeVisible();
  await expect(recovery).toBeFocused();
  assert.doesNotMatch(
    await page.locator("body").innerText(),
    /Private injected|application error: a client/i,
  );
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  accessibility.push({
    label: "page recovery",
    violations: result.violations.map((v) => v.id),
  });
  assert.equal(result.violations.length, 0);
  await page.screenshot({ path: `${folder}/recovery-desktop.png` });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      )
      .toBe(false);
  }
  await page.screenshot({ path: `${folder}/recovery-mobile.png` });
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(recovery).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again" })).toBeEnabled();
  checks.push(
    "A real client-rendering fault produces accessible recovery UI without leaking exception details; repeated failure remains recoverable",
  );

  await page
    .getByRole("navigation", { name: "Recovery navigation" })
    .getByRole("link", { name: "Contact us" })
    .click();
  await expect(page).toHaveURL(base + "/contact");
  await expect(page.locator("#contact-hero-title")).toHaveCount(1);
  await expect(page.locator(".contact-form-panel")).toBeVisible();
  assert.equal((await page.request.get(base + "/services")).status(), 200);
  assert.equal((await page.request.get(base + "/api/health")).status(), 200);
  checks.push(
    "Navigation leaves the broken route and healthy pages/API remain available",
  );

  await page.goto(base + "/blog", { waitUntil: "networkidle" });
  await expect(recovery).toBeVisible();
  await page.evaluate(() => {
    window.__pageFault = false;
  });
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator("#blog-hero-title")).toBeVisible();
  await expect(recovery).toHaveCount(0);
  await page.evaluate(() => {
    window.__pageFault = true;
    window.__stringFault = true;
    window.dispatchEvent(new Event("venizor-search"));
  });
  await expect(recovery).toBeVisible();
  assert.doesNotMatch(
    await page.locator("body").innerText(),
    /Private injected/,
  );
  checks.push(
    "Retry re-renders the route successfully; non-Error thrown values are also handled",
  );
  await context.close();

  const artworkContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await artworkContext.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...options) {
      if (kind === "webgl") throw new Error("Injected footer artwork failure");
      return original.call(this, kind, ...options);
    };
  });
  const artworkPage = await artworkContext.newPage();
  await artworkPage.goto(base, { waitUntil: "networkidle" });
  await artworkPage.locator(".studio-footer").scrollIntoViewIfNeeded();
  await expect(artworkPage.locator(".footer-shader")).toHaveCount(0);
  await expect(artworkPage.locator(".footer-wordmark")).toBeVisible();
  await expect(artworkPage.locator("main h1")).toBeVisible();
  await expect(artworkPage.locator(".page-recovery-shell")).toHaveCount(0);
  checks.push(
    "Footer animation failure removes the effect while retaining page content and footer navigation",
  );
  await artworkContext.close();

  const scrollContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  const scrollPage = await scrollContext.newPage();
  await scrollPage.goto(base + "/contact", { waitUntil: "networkidle" });
  await expect(scrollPage.locator("html")).toHaveClass(/\blenis\b/);
  await scrollPage.evaluate(() => {
    const original = window.scrollTo;
    let fail = true;
    window.scrollTo = function (...args) {
      if (fail && args[0]?.behavior === "instant") {
        fail = false;
        throw new Error("Injected scroll frame failure");
      }
      return original.apply(this, args);
    };
  });
  await scrollPage.mouse.move(700, 600);
  await scrollPage.mouse.wheel(0, 400);
  await expect(scrollPage.locator("html")).not.toHaveClass(/\blenis\b/);
  await scrollPage.mouse.wheel(0, 300);
  await expect
    .poll(() => scrollPage.evaluate(() => scrollY))
    .toBeGreaterThan(100);
  await expect(scrollPage.locator(".contact-form-panel")).toBeVisible();
  await expect(scrollPage.locator(".page-recovery-shell")).toHaveCount(0);
  checks.push(
    "An asynchronous scroll-frame failure cleans up the interpolator and leaves native scrolling and page content working",
  );
  await scrollContext.close();
  await writeFile(
    `${folder}/verification.json`,
    JSON.stringify({ checks, accessibility }, null, 2),
  );
  console.log(
    `Error recovery passed: ${checks.length} fault-injection groups, retry, navigation, native scrolling and responsive fallback.`,
  );
} finally {
  await browser.close();
}
