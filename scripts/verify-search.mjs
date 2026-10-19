import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const folder = "artifacts/search";
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
page.setDefaultTimeout(10000);
const checks = [],
  errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const dialog = page.locator("dialog[open]");
const input = dialog.getByRole("searchbox", { name: "Search this site" });
async function open(query = "") {
  await page.getByRole("button", { name: "Search site", exact: true }).click();
  await expect(input).toBeFocused();
  await expect(dialog.locator(".search-results")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  await input.fill(query);
}
async function follow(href) {
  await dialog.locator(`a[href="${href}"]`).click();
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(base + href);
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
}
async function visibleAnchor(id) {
  await expect
    .poll(
      () =>
        page.locator(`#${id}`).evaluate((node) => {
          const rect = node.getBoundingClientRect();
          return rect.top >= -4 && rect.top < innerHeight * 0.6;
        }),
      { timeout: 7000 },
    )
    .toBe(true);
}
try {
  const response = await context.request.get(base + "/api/search");
  assert.equal(response.status(), 200);
  const { entries } = await response.json();
  const home = await (await context.request.get(base + "/")).text();
  for (const entry of entries) {
    if (entry.href.includes("#")) {
      assert.ok(home.includes(`id="${entry.href.split("#")[1]}"`), entry.href);
    } else {
      assert.equal(
        (await context.request.get(base + entry.href)).status(),
        200,
        entry.href,
      );
    }
  }
  checks.push(
    `All ${entries.length} search destinations resolve to existing pages or homepage anchors`,
  );

  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await open();
  await expect(dialog.locator(".search-results > a")).toHaveCount(
    entries.length,
  );
  await input.fill("Products");
  await page.screenshot({ path: `${folder}/desktop.png` });
  const axe = await new AxeBuilder({ page })
    .include("dialog")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.equal(axe.violations.length, 0, JSON.stringify(axe.violations));
  await follow("/#products");
  await visibleAnchor("products");
  checks.push(
    "Inner-page search navigates to the homepage section, unlocks scrolling and passes accessibility checks",
  );

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await open("Industries");
  await follow("/#industries");
  await visibleAnchor("industries");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await open("Industries");
  await follow("/#industries");
  await visibleAnchor("industries");
  checks.push(
    "Same-page sections scroll correctly, including repeated searches for the current hash",
  );

  await page.goto(base + "/playbook", { waitUntil: "networkidle" });
  await open("Website development");
  await follow("/services/web-development");
  await open("idempotency retry");
  const article = entries.find(
    (entry) => entry.href === "/blog/connecting-third-party-https-apis",
  );
  assert.ok(article);
  await follow(article.href);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    article.title,
  );
  checks.push(
    "Service and article matches open the actual detail pages through client navigation",
  );

  await open("LLM calculator");
  await expect(dialog.locator('a[href="/tools"]')).toBeVisible();
  await input.fill("no-such-topic-987654");
  await expect(
    dialog.getByText("No matches yet.", { exact: false }),
  ).toBeVisible();
  await expect(dialog.locator('a[href="/contact"]')).toBeVisible();
  await dialog.getByRole("button", { name: "Clear search" }).click();
  await expect(input).toHaveValue("");
  for (const topic of [
    "Playbook",
    "Simulator",
    "Careers",
    "Tools",
    "Blog",
    "Scope",
  ]) {
    await dialog.getByRole("button", { name: topic, exact: true }).click();
    await expect(dialog.locator(".search-results > a").first()).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: topic, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  }
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Search site", exact: true }),
  ).toBeFocused();
  checks.push(
    "Metadata search, all topic buttons, clear, empty state and Escape focus restoration work",
  );

  await open("Privacy");
  const privacy = dialog.locator('a[href="/privacy"]');
  const popupPromise = context.waitForEvent("page");
  await privacy.click({ modifiers: ["ControlOrMeta"] });
  const popup = await popupPromise;
  await popup.waitForLoadState();
  await expect(popup).toHaveURL(base + "/privacy");
  await popup.close();
  await expect(dialog).toBeVisible();
  await privacy.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(base + "/privacy");
  await expect(dialog).toHaveCount(0);
  checks.push(
    "Keyboard Enter and new-tab modified clicks preserve standard link behavior",
  );

  await page.route("**/api/search", (route) =>
    route.fulfill({ status: 503, body: "Unavailable" }),
  );
  await page.getByRole("button", { name: "Search site", exact: true }).click();
  await expect(
    dialog.getByText("Search is temporarily unavailable."),
  ).toBeVisible();
  await expect(dialog.locator('a[href="/services"]')).toBeVisible();
  await page.unroute("**/api/search");
  await dialog.getByRole("button", { name: "Try search again" }).click();
  await expect(dialog.locator(".search-results > a")).toHaveCount(
    entries.length,
  );
  await page.keyboard.press("Escape");
  checks.push(
    "Failed search requests keep the page usable and recover through retry",
  );

  await page.route("**/api/search", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({ json: { entries } }).catch(() => {});
  });
  await page.getByRole("button", { name: "Search site", exact: true }).click();
  await expect(dialog.getByText("Loading site content…")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.unroute("**/api/search");
  await open("Careers");
  await expect(dialog.locator('a[href="/careers"]')).toBeVisible();
  await page.keyboard.press("Escape");
  checks.push(
    "Closing during loading cancels the request and reopening loads cleanly",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open("PostgreSQL");
  await expect(dialog.locator(".search-results > a").first()).toBeVisible();
  assert.ok(
    await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
  );
  const mobileAxe = await new AxeBuilder({ page })
    .include("dialog")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.equal(
    mobileAxe.violations.length,
    0,
    JSON.stringify(mobileAxe.violations),
  );
  await page.screenshot({ path: `${folder}/mobile.png` });
  await input.fill("Contact");
  await follow("/contact");
  checks.push(
    "Mobile search supports long article titles, reduced motion and working navigation without overflow",
  );

  assert.deepEqual(errors, []);
  await writeFile(
    `${folder}/verification.json`,
    JSON.stringify({ checks, entries: entries.length, errors }, null, 2),
  );
  console.log(
    JSON.stringify({ checks, entries: entries.length, errors }, null, 2),
  );
} catch (error) {
  console.log(
    await page.evaluate(() => ({
      active: document.activeElement?.outerHTML.slice(0, 300),
      dialogs: [...document.querySelectorAll("dialog")].map((node) =>
        node.outerHTML.slice(0, 200),
      ),
    })),
  );
  throw error;
} finally {
  await browser.close();
}
