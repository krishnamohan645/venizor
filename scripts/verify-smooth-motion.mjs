import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const folder = "artifacts/smooth-motion";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({
  ...(process.platform === "win32" ? { channel: "chrome" } : {}),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "no-preference",
});
const page = await context.newPage();
page.setDefaultTimeout(8000);
const checks = [],
  observations = {},
  errors = [];
page.on("pageerror", (error) => errors.push(error.message));
async function jump(y) {
  await page.evaluate(
    (value) => window.scrollTo({ top: value, behavior: "instant" }),
    y,
  );
  await page.waitForTimeout(100);
}
async function settled(y) {
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 3500 })
    .toBeGreaterThan(y - 3);
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 3500 })
    .toBeLessThan(y + 3);
}
try {
  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.evaluate(() => {
    window.__scrollSamples = [];
    window.addEventListener(
      "scroll",
      () => window.__scrollSamples.push({ y: scrollY, t: performance.now() }),
      { passive: true },
    );
  });
  await page.mouse.move(700, 600);
  await page.mouse.wheel(0, 480);
  await settled(480);
  const samples = await page.evaluate(() => window.__scrollSamples);
  assert.ok(
    samples.filter((sample) => sample.y > 0 && sample.y < 475).length > 4,
    JSON.stringify(samples),
  );
  observations.wheel = samples;
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(80);
  await page.mouse.wheel(0, -250);
  await settled(730);
  checks.push(
    "Wheel scrolling interpolates across frames and retargets when direction reverses",
  );

  await jump(0);
  await page.locator(".search-button").click();
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/lenis-stopped/);
  const lockedY = await page.evaluate(() => scrollY);
  await page.mouse.move(20, 500);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => scrollY), lockedY);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await expect(page.locator(".search-button")).toBeFocused();
  checks.push(
    "Dialogs stop background momentum, keep focus and unlock scrolling on close",
  );

  await page.getByRole("link", { name: "Tell us about your project" }).click();
  await expect(page).toHaveURL(/#project-brief$/);
  await expect
    .poll(
      () =>
        page.locator("#project-brief").evaluate((el) => {
          const padding =
            parseFloat(
              getComputedStyle(document.documentElement).scrollPaddingTop,
            ) || 0;
          const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
          return Math.abs(el.getBoundingClientRect().top - padding - margin);
        }),
      { timeout: 3000 },
    )
    .toBeLessThan(3);
  await page.screenshot({ path: `${folder}/contact-anchor.png` });
  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 300);
  await page.keyboard.press("Home");
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 3000 })
    .toBeLessThan(3);
  checks.push(
    "Anchor links settle at the intended section; keyboard Home cancels wheel momentum",
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  await page.mouse.wheel(0, 240);
  await settled(240);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.mouse.wheel(0, 240);
  await settled(480);
  checks.push(
    "Live reduced-motion changes remove and restore one scroller without duplicate wheel input",
  );

  await jump(0);
  await page.getByRole("link", { name: /^Blog/ }).first().click();
  await expect(page).toHaveURL(base + "/blog");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.mouse.move(700, 600);
  await page.mouse.wheel(0, 360);
  await settled(360);
  await page.goBack({ waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/contact/);
  await page.mouse.move(700, 500);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 220);
  await settled(before + 220);
  checks.push(
    "Client route navigation and browser history leave scrolling functional",
  );

  await page.goto(base + "/blog/connecting-third-party-https-apis", {
    waitUntil: "networkidle",
  });
  await jump(900);
  const progress = await page
    .locator(".reading-progress-fill")
    .evaluate((el) => ({
      transform: getComputedStyle(el).transform,
      width: el.offsetWidth,
      viewport: innerWidth,
    }));
  assert.notEqual(progress.transform, "matrix(0, 0, 0, 1, 0, 0)");
  assert.equal(progress.width, progress.viewport);
  observations.readingProgress = progress;
  checks.push(
    "Article progress updates its transform while keeping a constant width",
  );

  const codeTop = await page
    .locator(".code-pre-block")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);
  await jump(codeTop + 100);
  await page.evaluate(() => {
    window.__articleScrollSamples = [];
    window.addEventListener(
      "scroll",
      () => {
        window.__articleScrollSamples.push(scrollY);
      },
      { passive: true },
    );
  });
  for (const selector of [".code-pre-block", ".article-toc"]) {
    const target = page.locator(selector);
    const bounds = await target.boundingBox();
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      Math.max(120, Math.min(500, bounds.y + 100)),
    );
    const start = await page.evaluate(() => {
      window.__articleScrollSamples = [];
      return scrollY;
    });
    await page.mouse.wheel(0, 240);
    await settled(start + 240);
    const samples = await page.evaluate(() => window.__articleScrollSamples);
    assert.ok(
      samples.filter((y) => y > start && y < start + 235).length > 4,
      `${selector} should retain smooth vertical scrolling: ${JSON.stringify(samples)}`,
    );
  }
  checks.push(
    "Code examples and the article contents retain smooth page scrolling",
  );

  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  const gallery = page.locator(".project-scroll-section");
  await gallery.getByRole("tab").nth(2).click();
  await expect(gallery).toHaveAttribute("data-active-project", "2");
  await page.waitForTimeout(850);
  assert.equal(await gallery.getAttribute("data-active-project"), "2");
  await page.locator(".showcase").scrollIntoViewIfNeeded();
  const next = page.getByRole("button", { name: "Next scenario" });
  await next.click();
  await next.click();
  await next.click();
  await page.waitForTimeout(400);
  await expect(page.locator(".showcase-copy-layer > div")).toHaveCount(1);
  await expect(page.locator(".showcase-visual-stage > div")).toHaveCount(1);
  await page
    .locator(".showcase")
    .screenshot({ path: `${folder}/showcase.png` });
  checks.push(
    "Pinned project controls and rapid showcase changes settle without stale layers",
  );

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const phone = await mobile.newPage();
  phone.on("pageerror", (error) => errors.push(error.message));
  await phone.goto(base + "/playbook", { waitUntil: "networkidle" });
  await expect(phone.locator("html")).not.toHaveClass(/\blenis\b/);
  const cdp = await mobile.newCDPSession(phone);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 180, y: 650 }],
  });
  for (let y = 620; y >= 250; y -= 30) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 180, y }],
    });
    await phone.waitForTimeout(20);
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect.poll(() => phone.evaluate(() => scrollY)).toBeGreaterThan(100);
  assert.equal(
    await phone.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await phone.screenshot({ path: `${folder}/mobile-native-scroll.png` });

  await phone.goto(base + "/blog/securing-ai-production-systems", {
    waitUntil: "networkidle",
  });
  for (const width of [320, 390, 768]) {
    await phone.setViewportSize({ width, height: 844 });
    const clipped = await phone
      .locator(
        ".article-left-rail, .article-prose-wrap, .code-header-bar, .code-pre-block",
      )
      .evaluateAll((elements) =>
        elements
          .filter((el) => {
            const box = el.getBoundingClientRect();
            return box.left < 0 || box.right > innerWidth + 1;
          })
          .map((el) => el.className),
      );
    assert.deepEqual(clipped, [], `Article content clipped at ${width}px`);
  }
  await phone.setViewportSize({ width: 390, height: 844 });
  const snippet = phone.locator(".code-pre-block").first();
  await snippet.scrollIntoViewIfNeeded();
  await expect(phone.locator("html")).not.toHaveClass(/\blenis\b/);
  await phone.mouse.move(180, 400);
  await phone.mouse.wheel(180, 0);
  await expect
    .poll(() => snippet.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(20);
  const beforeSwipe = await phone.evaluate(() => scrollY);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 180, y: 650 }],
  });
  for (let y = 620; y >= 250; y -= 30) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 180, y }],
    });
    await phone.waitForTimeout(20);
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => phone.evaluate(() => scrollY))
    .toBeGreaterThan(beforeSwipe + 100);
  await phone.screenshot({ path: `${folder}/article-mobile-scroll.png` });
  checks.push(
    "Mobile articles fit the viewport; code scrolls horizontally and vertical touch gestures scroll the page",
  );
  await mobile.close();
  checks.push("Touch viewport retains native scrolling and fits the screen");
  assert.deepEqual(errors, []);
  await writeFile(
    `${folder}/verification.json`,
    JSON.stringify({ checks, observations, errors }, null, 2),
  );
  console.log(
    `Smooth motion passed: ${checks.length} interaction groups, wheel samples, live preferences and native touch.`,
  );
} finally {
  await browser.close();
}
