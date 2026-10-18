import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

await mkdir("artifacts/motion", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (
    message.type() === "error" &&
    /hydrat|server rendered|uncaught/i.test(message.text())
  )
    errors.push(message.text());
});
const observations = {};
const checks = [];
const settle = () => page.waitForTimeout(1050);
const jump = async (y) => {
  await page.evaluate(
    (value) => window.scrollTo({ top: value, behavior: "instant" }),
    y,
  );
  await settle();
};
try {
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".studio-intro")).visibility ===
      "visible",
    undefined,
    { timeout: 7000 },
  );
  const firstIntro = await page
    .locator(".intro-word")
    .first()
    .evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(220);
  const secondIntro = await page
    .locator(".intro-word")
    .first()
    .evaluate((el) => getComputedStyle(el).transform);
  assert.notEqual(firstIntro, secondIntro);
  observations.intro = { before: firstIntro, after: secondIntro };
  checks.push("Intro visibly animates on a fresh session");
  await page.waitForTimeout(3300);
  assert.equal(await page.locator(".studio-intro").isVisible(), false);
  const tile = page.locator(".mosaic-tile:nth-child(3n + 1) i").first();
  const tileBefore = await page
    .locator(".mosaic-tile i")
    .evaluateAll((elements) =>
      elements.map((el) => getComputedStyle(el).transform),
    );
  await page.waitForTimeout(1600);
  const tileAfter = await page
    .locator(".mosaic-tile i")
    .evaluateAll((elements) =>
      elements.map((el) => getComputedStyle(el).transform),
    );
  assert.notDeepEqual(tileBefore, tileAfter);
  observations.heroTile = {
    movingTiles: tileAfter.filter((value, index) => value !== tileBefore[index])
      .length,
  };
  checks.push("Hero geometry visibly rotates over time");
  await page.screenshot({ path: "artifacts/motion/hero.png" });
  await page.getByRole("button", { name: "Pause artwork animation" }).click();
  const pausedBefore = await tile.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  await page.waitForTimeout(300);
  assert.equal(
    await tile.evaluate((el) => getComputedStyle(el).transform),
    pausedBefore,
  );
  checks.push("Hero motion pauses immediately");

  const word = page.locator(".scroll-word-ink").last();
  const wordBefore = await word.evaluate((el) =>
    Number(getComputedStyle(el).opacity),
  );
  const aboutEnd = await page
    .locator("#about")
    .evaluate(
      (el) =>
        el.getBoundingClientRect().bottom +
        window.scrollY -
        window.innerHeight * 0.4,
    );
  await jump(aboutEnd);
  const wordAfter = await word.evaluate((el) =>
    Number(getComputedStyle(el).opacity),
  );
  assert.ok(wordAfter > wordBefore + 0.5);
  observations.manifesto = { before: wordBefore, after: wordAfter };
  checks.push("Studio statement fills in as the page scrolls");

  await page.waitForFunction(
    () =>
      document.querySelector(".project-scroll-section")?.dataset.scroll ===
      "true",
  );
  const story = await page.locator(".project-scroll-section").evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    return { start: top - 24, distance: rect.height - window.innerHeight + 48 };
  });
  await jump(story.start + story.distance * 0.05);
  const pinnedBefore = await page.locator(".project-pin-shell").boundingBox();
  const trackBefore = await page
    .locator(".project-scroll-track")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.screenshot({ path: "artifacts/motion/work-start.png" });
  await jump(story.start + story.distance * 0.74);
  const pinnedAfter = await page.locator(".project-pin-shell").boundingBox();
  const trackAfter = await page
    .locator(".project-scroll-track")
    .evaluate((el) => getComputedStyle(el).transform);
  assert.ok(
    Math.abs(pinnedBefore.y - pinnedAfter.y) < 3,
    `Pinned work scene moved: ${pinnedBefore.y} to ${pinnedAfter.y}`,
  );
  assert.notEqual(trackBefore, trackAfter);
  assert.equal(
    await page
      .locator(".project-scroll-section")
      .getAttribute("data-active-project"),
    "2",
  );
  observations.projects = {
    pinnedBefore: pinnedBefore.y,
    pinnedAfter: pinnedAfter.y,
    trackBefore,
    trackAfter,
  };
  checks.push(
    "Projects stay pinned while vertical scrolling moves the cards horizontally",
  );
  await page.screenshot({ path: "artifacts/motion/work-scrolled.png" });

  const processSecond = await page
    .locator(".timeline-step")
    .nth(1)
    .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await jump(processSecond - 300);
  const cardBefore = await page.locator(".timeline-step").first().boundingBox();
  await jump(processSecond - 125);
  const cardAfter = await page.locator(".timeline-step").first().boundingBox();
  assert.ok(
    Math.abs(cardBefore.y - cardAfter.y) < 3,
    `Process card did not stay stacked: ${cardBefore.y}, ${cardAfter.y}`,
  );
  assert.equal(
    await page
      .locator(".timeline-step")
      .first()
      .evaluate((el) => getComputedStyle(el).position),
    "sticky",
  );
  observations.process = { before: cardBefore.y, after: cardAfter.y };
  checks.push(
    "Process cards stack and hold their position as the next step arrives",
  );
  await page.screenshot({ path: "artifacts/motion/process-stack.png" });
  const processFirst = await page
    .locator(".timeline-content")
    .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await jump(processFirst - 100);
  assert.equal(
    await page
      .locator(".timeline-index a")
      .first()
      .getAttribute("aria-current"),
    "step",
  );
  checks.push("Process navigation tracks the current card when scrolling back");

  await page.setViewportSize({ width: 390, height: 844 });
  await settle();
  assert.equal(
    await page.locator(".project-scroll-section").getAttribute("data-scroll"),
    null,
  );
  checks.push("Mobile uses a swipeable gallery without a long pinned scene");
  const mobileGallery = await page
    .locator(".project-viewport")
    .evaluate((el) => ({
      visibleIndex: Math.round(el.scrollLeft / el.clientWidth),
      width: el.clientWidth,
    }));
  assert.equal(
    String(mobileGallery.visibleIndex),
    await page
      .locator(".project-scroll-section")
      .getAttribute("data-active-project"),
  );
  checks.push("Selected project remains visible when switching to mobile");
  const mobileTop = await page
    .locator("#work")
    .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await jump(mobileTop + 150);
  await page.screenshot({ path: "artifacts/motion/mobile-work.png" });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page.locator(".project-scroll-section").getAttribute("data-scroll"),
    null,
  );
  assert.equal(
    await page
      .locator(".timeline-step")
      .first()
      .evaluate((el) => getComputedStyle(el).position),
    "relative",
  );
  assert.equal(await page.locator(".studio-intro").isVisible(), false);
  assert.equal(
    await page
      .locator(".scroll-word-ink")
      .last()
      .evaluate((el) => Number(getComputedStyle(el).opacity)),
    1,
  );
  checks.push(
    "Reduced motion restores static, readable content and removes pinning",
  );
  assert.deepEqual(errors, []);
  checks.push("No runtime or hydration errors");
  await writeFile(
    "artifacts/motion/verification.json",
    JSON.stringify({ checks, observations, errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, observations, errors }, null, 2));
} finally {
  await context.close();
  await browser.close();
}
