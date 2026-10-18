import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (
    message.type() === "error" &&
    /hydrat|server rendered|uncaught/i.test(message.text())
  )
    errors.push(message.text());
});
const checks = [];
try {
  const response = await page.goto("http://localhost:3000", {
    waitUntil: "networkidle",
  });
  assert.equal(response.status(), 200);
  await page.waitForTimeout(3800);
  await page.screenshot({ path: "artifacts/desktop-hero.png" });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(150);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
      false,
      `Page overflow at ${width}px`,
    );
    const textFits = await page.locator("h1").evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return Array.from(range.getClientRects()).every(
        (rect) => rect.left >= -1 && rect.right <= window.innerWidth + 1,
      );
    });
    assert.ok(textFits, `Hero text fits at ${width}px`);
    const mosaic = await page.locator(".mosaic-tile").first().boundingBox();
    assert.ok(
      Math.abs(mosaic.width - mosaic.height) < 2,
      `Hero geometry remains square at ${width}px`,
    );
    const productArt = await page.locator(".product-ribbons").boundingBox();
    const productText = await page.locator(".bento-main > p").boundingBox();
    assert.ok(
      productArt.y >= productText.y + productText.height,
      `Product visual clears the text at ${width}px`,
    );
    checks.push(`Layout and hero text fit at ${width}px`);
    if (width === 1440 || width === 390 || width === 768) {
      await page.screenshot({
        path: `artifacts/${width === 1440 ? "desktop" : width === 390 ? "mobile" : "tablet"}.png`,
        fullPage: true,
      });
    }
  }
  assert.equal(
    await page
      .locator('img[src*="chrome-wave"], img[src*="chrome-accordion"]')
      .count(),
    0,
  );
  checks.push("No generated image assets are used");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: /^Services/ })
    .click();
  assert.match(page.url(), /#services$/);
  assert.equal(
    await page
      .getByRole("button", { name: "Open navigation" })
      .getAttribute("aria-expanded"),
    "false",
  );
  checks.push("Mobile navigation opens, navigates, and closes");
  await page.setViewportSize({ width: 1440, height: 1000 });
  const aiService = page.getByRole("button", { name: /04 AI & automation/ });
  await aiService.focus();
  await page.keyboard.press("Enter");
  assert.equal(await aiService.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Enter");
  assert.equal(await aiService.getAttribute("aria-expanded"), "false");
  checks.push("Services expand and collapse from the keyboard");
  const projectTabs = page.getByRole("tablist", { name: "Select a project" });
  await projectTabs.getByRole("tab", { name: /Form & Field/ }).click();
  await page.waitForTimeout(1000);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(100);
  assert.equal(
    await projectTabs
      .getByRole("tab", { name: /Orbit/ })
      .getAttribute("aria-selected"),
    "true",
  );
  await page.getByRole("button", { name: "Next project", exact: true }).click();
  await page.waitForTimeout(1000);
  assert.equal(
    await projectTabs
      .getByRole("tab", { name: /Everyday/ })
      .getAttribute("aria-selected"),
    "true",
  );
  await page
    .getByRole("button", { name: "Previous project", exact: true })
    .click();
  await page.waitForTimeout(1000);
  assert.equal(
    await projectTabs
      .getByRole("tab", { name: /Orbit/ })
      .getAttribute("aria-selected"),
    "true",
  );
  checks.push(
    "Project slider supports tabs, arrow keys, and direction controls",
  );
  await page
    .getByRole("button", { name: "Explore concept", exact: true })
    .click();
  assert.equal(
    await page.getByRole("dialog").getByRole("heading").textContent(),
    "Orbit",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Explore concept", exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  checks.push("Project detail dialog restores keyboard focus");
  await page
    .getByRole("button", { name: "Website Development", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Let’s talk about your idea" })
    .click();
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Website Development", exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  checks.push(
    "Service-to-enquiry transition retains its original focus target",
  );
  await page
    .getByRole("button", { name: "Discuss your project", exact: true })
    .click();
  await page.getByLabel("Your name", { exact: true }).fill("Alex Test");
  await page.getByLabel("Work email", { exact: true }).fill("alex@example.com");
  await page
    .getByLabel("A little about your idea", { exact: true })
    .fill("Build a thoughtful digital experience.");
  await page.getByRole("button", { name: "Prepare your enquiry" }).click();
  const mailto = await page
    .getByRole("link", { name: "Open in your email app" })
    .getAttribute("href");
  assert.ok(mailto.startsWith("mailto:info@venizor.com?"));
  assert.ok(decodeURIComponent(mailto).includes("Alex Test"));
  await page.screenshot({ path: "artifacts/enquiry.png" });
  await page.getByLabel("Your name", { exact: true }).fill("Alex Revised");
  assert.equal(
    await page.getByRole("link", { name: "Open in your email app" }).count(),
    0,
  );
  await page.keyboard.press("Escape");
  checks.push(
    "Enquiry creates a reviewable email draft and invalidates stale drafts",
  );
  await page.getByRole("button", { name: "Search site" }).click();
  await page
    .getByRole("textbox", { name: "Search this site" })
    .fill("services");
  assert.equal(await page.getByRole("dialog").getByRole("link").count(), 1);
  await page.keyboard.press("Escape");
  checks.push("Site search filters navigation");
  await page.locator("#process").scrollIntoViewIfNeeded();
  await page.locator("#step-2").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  assert.equal(await page.locator(".timeline-index a.active").count(), 1);
  checks.push("Process timeline tracks the active step");
  await page.locator("#industries").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  const sticker = page.getByRole("button", {
    name: "Explore Technology & SaaS",
    exact: true,
  });
  await sticker.focus();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter");
  assert.equal(
    await page
      .getByRole("region", { name: "Technology & SaaS solutions", exact: true })
      .count(),
    1,
  );
  checks.push(
    "Industry wall supports keyboard movement and inline solution selection",
  );
  await page.getByRole("button", { name: "Pause artwork animation" }).click();
  assert.equal(
    await page.getByRole("button", { name: "Play artwork animation" }).count(),
    1,
  );
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Pause footer animation" }).click();
  assert.equal(
    await page.getByRole("button", { name: "Play footer animation" }).count(),
    1,
  );
  checks.push("Hero and shader motion can be paused");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".motion-toggle").isVisible(), false);
  assert.equal(await page.locator(".footer-motion-toggle").isVisible(), false);
  assert.equal(await page.locator(".studio-intro").isVisible(), false);
  checks.push("Reduced motion disables the intro and motion controls");
  assert.deepEqual(errors, []);
  checks.push("No browser runtime or hydration errors");
  await writeFile(
    "artifacts/verification.json",
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
