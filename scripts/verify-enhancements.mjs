import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("artifacts/enhancements", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const checks = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (
    message.type() === "error" &&
    /hydrat|server rendered|uncaught/i.test(message.text())
  )
    errors.push(message.text());
});
const transform = (selector) =>
  page
    .locator(selector)
    .first()
    .evaluate((el) => getComputedStyle(el).transform);
try {
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3800);
  await page.mouse.move(150, 150);
  await page.mouse.move(600, 300, { steps: 10 });
  await page.waitForTimeout(400);
  const cursor = await page.locator(".cursor-follower").boundingBox();
  assert.ok(Math.abs(cursor.x + cursor.width / 2 - 600) < 2);
  assert.ok(Math.abs(cursor.y + cursor.height / 2 - 300) < 2);
  assert.equal(
    await page
      .locator(".cursor-follower")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  await page.keyboard.press("Tab");
  await page.waitForTimeout(250);
  assert.equal(
    await page
      .locator(".cursor-follower")
      .evaluate((el) => getComputedStyle(el).opacity),
    "0",
  );
  checks.push(
    "Small round cursor follows mouse position and hides for keyboard navigation",
  );

  await page.locator(".hero-sculpture").scrollIntoViewIfNeeded();
  const artwork = await page.locator(".hero-sculpture").boundingBox();
  await page.mouse.move(
    artwork.x + artwork.width / 2,
    artwork.y + artwork.height / 2,
  );
  await page.waitForTimeout(800);
  assert.equal(
    await page
      .locator(".hero-pointer-light")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  checks.push("Hero artwork responds to pointer movement");

  assert.equal(await page.locator(".service-row").count(), 8);
  await page.mouse.move(2, 2);
  for (const row of await page.locator(".service-row").all()) {
    const button = row.locator(".service-row-heading");
    await button.focus();
    if ((await button.getAttribute("aria-expanded")) !== "true")
      await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    assert.equal(await button.getAttribute("aria-expanded"), "true");
    assert.equal(
      await row.locator(".service-panel").evaluate((el) => el.inert),
      false,
    );
    assert.ok(
      (await row.locator(".service-description").innerText()).length > 100,
    );
  }
  await page.waitForTimeout(600);
  const artMotion = page
    .locator(".service-row.active .service-art-ring")
    .first();
  const ringBefore = await artMotion.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  await page.waitForTimeout(400);
  assert.notEqual(
    await artMotion.evaluate((el) => getComputedStyle(el).transform),
    ringBefore,
  );
  checks.push(
    "All eight services have complete keyboard-accessible animated panels",
  );
  await page
    .locator("#services")
    .screenshot({ path: "artifacts/enhancements/services.png" });

  await page.getByRole("tab", { name: /Orbit/ }).focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1200);
  assert.match(
    await page.locator(".project-live-description").textContent(),
    /business workspace/,
  );
  const barScale = () =>
    page
      .locator('.project-slide[data-active="true"] .bar-chart i')
      .first()
      .evaluate((el) => getComputedStyle(el).scale);
  const firstBar = await barScale();
  await page.waitForTimeout(600);
  assert.notEqual(await barScale(), firstBar);
  await page
    .getByRole("button", { name: "Pause project preview motion" })
    .click();
  const pausedBar = await barScale();
  await page.waitForTimeout(400);
  assert.equal(await barScale(), pausedBar);
  checks.push(
    "Project selection updates editorial content; live chart animation pauses correctly",
  );
  await page
    .locator(".project-pin-shell")
    .screenshot({ path: "artifacts/enhancements/projects.png" });

  await page.locator(".product-bento").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  const orbBefore = await transform(".clarity-orb");
  await page.waitForTimeout(700);
  assert.notEqual(await transform(".clarity-orb"), orbBefore);
  await page.getByRole("button", { name: "Pause product animations" }).click();
  const orbPaused = await transform(".clarity-orb");
  await page.waitForTimeout(450);
  assert.equal(await transform(".clarity-orb"), orbPaused);
  checks.push(
    "Product sculptures animate over time and stop with the pause control",
  );
  await page
    .locator(".product-motion")
    .screenshot({ path: "artifacts/enhancements/products.png" });

  await page.locator("#step-2").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  assert.match(
    await page.locator(".process-live").getAttribute("aria-label"),
    /Create/,
  );
  await page.locator("#step-2 summary").click();
  assert.equal(await page.locator("#step-2 details").getAttribute("open"), "");
  assert.match(
    await page.locator("#step-2 details").innerText(),
    /Interactive prototypes/,
  );
  checks.push(
    "Process progress follows scrolling and phase deliverables expand",
  );
  await page.screenshot({ path: "artifacts/enhancements/process.png" });

  const industries = page.locator(".industry-options button");
  const headings = new Set();
  for (let i = 0; i < (await industries.count()); i++) {
    await industries.nth(i).click();
    await page.waitForTimeout(50);
    assert.equal(await industries.nth(i).getAttribute("aria-pressed"), "true");
    headings.add(await page.locator(".industry-solution h3").textContent());
    assert.equal(
      await page.locator(".industry-solution .service-tags span").count(),
      3,
    );
  }
  assert.equal(headings.size, 8);
  await industries.first().click();
  await page.waitForTimeout(450);
  checks.push(
    "All eight industry selections show distinct solutions and useful examples",
  );
  await page
    .locator(".industry-playground-wrap")
    .screenshot({ path: "artifacts/enhancements/industries.png" });
  await page
    .getByRole("button", { name: "Let’s talk about your world" })
    .click();
  assert.equal(await page.getByRole("dialog").isVisible(), true);
  await page.keyboard.press("Escape");
  checks.push("Industry call to action opens the project enquiry form");

  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.waitForTimeout(350);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `No overflow at ${width}`,
    );
    await industries.nth(6).click();
    assert.match(
      await page.locator(".industry-solution h3").textContent(),
      /moving part/,
    );
  }
  await page
    .locator(".industry-playground-wrap")
    .screenshot({ path: "artifacts/enhancements/mobile-industries.png" });
  checks.push(
    "Industry selector and completed content work at tablet and mobile widths",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".cursor-follower").isVisible(), false);
  assert.equal(await page.locator(".product-motion-toggle").isVisible(), false);
  assert.equal(
    await page.locator(".project-preview-toggle").isVisible(),
    false,
  );
  assert.equal(
    await page
      .locator(".industry-orbit")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  checks.push(
    "Reduced motion removes the pointer follower and new decorative loops without hydration errors",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/enhancements/verification.json",
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
