import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const folder = "artifacts/refinement";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({
  ...(process.platform === "win32" ? { channel: "chrome" } : {}),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [],
  pages = [],
  accessibility = [],
  checks = [];
page.on("pageerror", (error) => errors.push(error.message));
async function inspect(label) {
  const scan = await page.evaluate(() => {
    const fonts = new Set(),
      dark = [];
    const selector = (el) =>
      el.tagName.toLowerCase() +
      (el.id
        ? `#${el.id}`
        : el.classList.length
          ? "." + [...el.classList].join(".")
          : "");
    const isDark = (color) => {
      const rgb = color.match(/[\d.]+/g)?.map(Number);
      return (
        rgb &&
        (rgb[3] ?? 1) > 0.8 &&
        Math.max(...rgb.slice(0, 3)) - Math.min(...rgb.slice(0, 3)) < 70 &&
        rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 < 130
      );
    };
    for (const el of document.querySelectorAll("main *, footer *")) {
      const rect = el.getBoundingClientRect(),
        style = getComputedStyle(el);
      if (
        !rect.width ||
        !rect.height ||
        style.display === "none" ||
        style.visibility === "hidden"
      )
        continue;
      if (
        [...el.childNodes].some(
          (node) => node.nodeType === 3 && node.textContent.trim(),
        )
      )
        fonts.add(style.fontFamily);
      if (
        !el.closest(".studio-footer") &&
        rect.width > 100 &&
        rect.height > 60 &&
        isDark(style.backgroundColor)
      )
        dark.push({ selector: selector(el), color: style.backgroundColor });
      if (
        el.tagName.toLowerCase() === "rect" &&
        !el.closest(".studio-footer") &&
        rect.width > 150 &&
        rect.height > 85 &&
        isDark(style.fill)
      )
        dark.push({ selector: selector(el), fill: style.fill });
    }
    return {
      fonts: [...fonts],
      dark,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  pages.push({ label, ...scan });
}
async function axe(label) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  accessibility.push({
    label,
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
try {
  const sitemap = await (await page.request.get(base + "/sitemap.xml")).text();
  const routes = [
    ...new Set(
      [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
        (match) => new URL(match[1]).pathname,
      ),
    ),
  ];
  for (const route of routes) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    const response = await page.goto(base + route, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200, route);
    await inspect(route);
    if (
      [
        "/",
        "/blog",
        "/contact",
        "/playbook",
        "/tools",
        "/simulator",
        "/services/web-development",
        "/blog/connecting-third-party-https-apis",
      ].includes(route)
    )
      await axe(route);
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await inspect(`${route} @${width}`);
    }
    if (["/contact", "/blog"].includes(route)) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({
        path: `${folder}/final-${route.slice(1)}-mobile.png`,
      });
    }
  }
  checks.push(
    `Scanned all ${routes.length} public URLs on desktop and at 390/320px`,
  );

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/tools", { waitUntil: "networkidle" });
  for (const name of [
    "LLM Token & Cost Calculator",
    "Security Headers & CSP Generator",
  ]) {
    await page.getByRole("button", { name }).click();
    await inspect(`/tools / ${name}`);
    await axe(`/tools / ${name}`);
  }
  await page.goto(base + "/simulator", { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "RAG & Hybrid Vector Search Simulator" })
    .click();
  await inspect("/simulator / retrieval");
  await axe("/simulator / retrieval");
  await page.getByRole("button", { name: "Run Intelligent Retrieval" }).click();
  await page.locator(".rag-result-pane").waitFor();
  await inspect("/simulator / result");
  await page.goto(base + "/scope", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Continue to Capabilities" }).click();
  await page.getByRole("button", { name: "Continue to Scale & SLA" }).click();
  await page.getByRole("button", { name: "Review Scoping Brief" }).click();
  await inspect("/scope / result");
  await axe("/scope / result");
  checks.push(
    "Checked hidden calculator, header generator, retrieval and scope-result states",
  );

  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await page.locator('input[name="name"]').fill("Alex Example");
  await page.locator('input[name="email"]').fill("alex@example.com");
  await page
    .locator('textarea[name="message"]')
    .fill("We want to plan a useful customer portal.");
  assert.equal(
    await page
      .getByRole("progressbar", { name: "Brief details completed" })
      .getAttribute("aria-valuenow"),
    "3",
  );
  await page.getByRole("button", { name: "Email this brief" }).waitFor();
  checks.push(
    "Contact progress reflects real field validity; deferred delivery remains explicit",
  );

  await page.goto(base + "/", { waitUntil: "networkidle" });
  const showcase = page.locator(".showcase");
  await showcase.scrollIntoViewIfNeeded();
  await page
    .getByRole("button", { name: "Next scenario", exact: true })
    .click();
  await page
    .getByRole("heading", {
      name: "Useful answers, with a source.",
      exact: true,
    })
    .waitFor();
  await showcase.focus();
  await page.keyboard.press("ArrowRight");
  await page
    .getByRole("heading", {
      name: "A clearer view of operations.",
      exact: true,
    })
    .waitFor();
  await inspect("/ / showcase selection");
  await page.screenshot({ path: `${folder}/final-showcase-desktop.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await inspect("/ / showcase mobile");
  await showcase.screenshot({ path: `${folder}/final-showcase-mobile.png` });
  checks.push("Project showcase supports buttons and keyboard selection");

  const motionContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  const motion = await motionContext.newPage();
  await motion.goto(base + "/contact", { waitUntil: "networkidle" });
  const envelope = motion.locator(".contact-mark-envelope");
  const before = await envelope.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  await motion.waitForTimeout(400);
  assert.notEqual(
    await envelope.evaluate((el) => getComputedStyle(el).transform),
    before,
  );
  await motion
    .getByRole("button", { name: "Pause contact illustration" })
    .click();
  assert.equal(
    await envelope.evaluate((el) => getComputedStyle(el).animationPlayState),
    "paused",
  );
  await motion.screenshot({ path: `${folder}/final-contact-desktop.png` });
  await motion.goto(base + "/blog", { waitUntil: "networkidle" });
  await motion.screenshot({ path: `${folder}/final-blog-desktop.png` });
  await motion.close();
  await motionContext.close();
  checks.push(
    "Contact illustration visibly animates and pauses; reduced motion used for the full-route audit",
  );

  const problems = pages.filter(
    (item) =>
      item.dark.length ||
      item.overflow ||
      item.fonts.some((font) => !font.startsWith("Geist,")),
  );
  const serious = accessibility.flatMap((item) =>
    item.violations
      .filter((violation) => ["serious", "critical"].includes(violation.impact))
      .map((violation) => ({ label: item.label, ...violation })),
  );
  await writeFile(
    `${folder}/verification.json`,
    JSON.stringify(
      { checks, pages, accessibility, problems, serious, errors },
      null,
      2,
    ),
  );
  assert.equal(
    problems.length,
    0,
    "Theme/typography/layout issues: see artifacts/refinement/verification.json",
  );
  assert.deepEqual(
    serious,
    [],
    "Accessibility issues: see artifacts/refinement/verification.json",
  );
  assert.deepEqual(errors, []);
  console.log(
    `Light-system audit passed: ${routes.length} public routes, ${pages.length} page/state/viewport scans, ${accessibility.length} accessibility scans.`,
  );
} finally {
  await writeFile(
    `${folder}/verification-progress.json`,
    JSON.stringify({ checks, pages, accessibility, errors }, null, 2),
  );
  await browser.close();
}
