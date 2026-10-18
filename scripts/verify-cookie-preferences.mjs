import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const configured = process.env.COOKIE_TEST_MODE === "optional";
const mode = configured ? "mock-providers" : "default-off";
const folder = "artifacts/cookies";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({
  ...(process.platform === "win32" ? { channel: "chrome" } : {}),
  headless: true,
});
const checks = [],
  requests = [],
  errors = [],
  accessibility = [];
async function newContext() {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (
      /google-analytics\.com$|googletagmanager\.com$|vercel-insights\.com$|vercel-scripts\.com$/.test(
        url.hostname,
      ) ||
      url.pathname.startsWith("/_vercel/")
    ) {
      requests.push(url.href);
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: "window.__mockAnalyticsScripts = (window.__mockAnalyticsScripts || 0) + 1;",
      });
    } else await route.continue();
  });
  return context;
}
async function scan(page, label) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  accessibility.push({
    label,
    violations: result.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  });
  assert.equal(result.violations.length, 0, JSON.stringify(accessibility));
}
try {
  const context = await newContext();
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base + "/contact?utm_source=consent-test", {
    waitUntil: "networkidle",
  });
  assert.equal(requests.length, 0);
  assert.equal(
    await page.evaluate(() => sessionStorage.getItem("venizor-attribution")),
    null,
  );
  await expect(page.locator(".cookie-banner")).toHaveCount(configured ? 1 : 0);
  checks.push(
    "No analytics requests or referral storage occur before permission; the banner matches configured services",
  );

  if (configured) {
    await scan(page, "first-visit banner");
    await page.screenshot({ path: `${folder}/banner-desktop.png` });
    await page
      .getByRole("button", { name: "Necessary only", exact: true })
      .click();
    await expect(page.locator(".cookie-banner")).toHaveCount(0);
    assert.equal(requests.length, 0);
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator(".cookie-banner")).toHaveCount(0);
    assert.equal(requests.length, 0);
    checks.push(
      "Necessary only persists across reloads and leaves all optional scripts blocked",
    );
  }
  const settings = page.getByRole("button", {
    name: "Cookie settings",
    exact: true,
  });
  await settings.click();
  const dialog = page.getByRole("dialog", { name: "Cookie preferences." });
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Cookie preferences." }),
  ).toBeFocused();
  const analytics = page.getByRole("switch", {
    name: "Allow optional analytics",
  });
  await expect(analytics).not.toBeChecked();
  if (!configured) await expect(analytics).toBeDisabled();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(
        () =>
          document.activeElement === document.body ||
          Boolean(document.activeElement?.closest(".cookie-dialog")),
      ),
      true,
    );
  }
  await scan(page, "preferences dialog");
  await dialog.screenshot({ path: `${folder}/settings-${mode}.png` });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(settings).toBeFocused();
  assert.equal(requests.length, 0);
  checks.push(
    "The settings dialog has focus trapping, Escape, focus restoration and no automatic permission change",
  );

  await settings.click();
  if (configured) {
    await analytics.check();
    await page.keyboard.press("Escape");
    assert.equal(requests.length, 0);
    await settings.click();
    await expect(analytics).not.toBeChecked();
    await analytics.check();
  }
  await page.getByRole("button", { name: "Save preferences" }).click();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("venizor-cookie-consent")),
  );
  assert.equal(saved.analytics, configured);
  assert.equal(saved.version, 1);
  assert.equal(saved.expiresAt - saved.savedAt, 180 * 24 * 60 * 60 * 1000);

  if (configured) {
    await expect
      .poll(() => page.evaluate(() => window.__mockAnalyticsScripts || 0))
      .toBeGreaterThanOrEqual(3);
    const state = await page.evaluate(() => ({
      commands: window.dataLayer.map((row) => [row[0], row[1]]),
      attribution: JSON.parse(sessionStorage.getItem("venizor-attribution")),
      web: window.vaq
        .filter((row) => row[0] === "beforeSend")
        .map(
          (row) => row[1]({ type: "pageview", url: location.href }) !== null,
        ),
      speed: window.siq
        .filter((row) => row[0] === "beforeSend")
        .map((row) => row[1]({ type: "vital", url: location.href }) !== null),
    }));
    assert.ok(
      state.commands.findIndex(
        (row) => row[0] === "consent" && row[1] === "default",
      ) < state.commands.findIndex((row) => row[0] === "config"),
    );
    assert.equal(state.attribution.utm_source, "consent-test");
    assert.ok(state.web.length && state.web.every(Boolean));
    assert.ok(state.speed.length && state.speed.every(Boolean));
    checks.push(
      "Explicit permission loads only intercepted provider scripts; consent defaults precede Google configuration and Vercel guards allow authorized events",
    );

    const other = await context.newPage();
    await other.goto(base + "/blog", { waitUntil: "networkidle" });
    await expect(other.locator(".cookie-banner")).toHaveCount(0);
    await page.evaluate(() => {
      document.cookie = "_ga=mock; path=/";
      document.cookie = "_ga_CONSENTTEST=mock; path=/";
      document.cookie = "app_session=keep; path=/";
    });
    await settings.click();
    await page.getByRole("button", { name: "Reject optional" }).click();
    await expect
      .poll(() => other.evaluate(() => window["ga-disable-G-CONSENTTEST"]))
      .toBe(true);
    const revoked = await page.evaluate(() => ({
      cookie: document.cookie,
      referral: sessionStorage.getItem("venizor-attribution"),
      disabled: window["ga-disable-G-CONSENTTEST"],
      web: window.vaq
        .filter((row) => row[0] === "beforeSend")
        .map((row) => row[1]({ type: "pageview", url: location.href })),
      speed: window.siq
        .filter((row) => row[0] === "beforeSend")
        .map((row) => row[1]({ type: "vital", url: location.href })),
    }));
    assert.equal(revoked.disabled, true);
    assert.equal(revoked.referral, null);
    assert.doesNotMatch(revoked.cookie, /_ga=/);
    assert.doesNotMatch(revoked.cookie, /_ga_CONSENTTEST=/);
    assert.match(revoked.cookie, /app_session=keep/);
    assert.ok(revoked.web.every((value) => value === null));
    assert.ok(revoked.speed.every((value) => value === null));
    checks.push(
      "Withdrawal disables loaded Google tracking, removes accessible analytics cookies/referral data, blocks Vercel events and synchronizes across tabs",
    );
    await other.close();

    await page.evaluate(() => {
      const value = JSON.parse(localStorage.getItem("venizor-cookie-consent"));
      value.expiresAt = Date.now() - 1;
      localStorage.setItem("venizor-cookie-consent", JSON.stringify(value));
      window.dispatchEvent(new Event("venizor-cookie-consent-change"));
    });
    await expect(page.locator(".cookie-banner")).toHaveCount(1);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      )
      .toBe(false);
    await page.screenshot({ path: `${folder}/banner-mobile.png` });
    await page.getByRole("button", { name: "Customize choices" }).click();
  } else {
    assert.equal(requests.length, 0);
    await settings.click();
  }
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(dialog).toBeVisible();
    await expect
      .poll(() =>
        dialog.evaluate(
          (el) =>
            el.getBoundingClientRect().width <= innerWidth &&
            el.getBoundingClientRect().height <= innerHeight,
        ),
      )
      .toBe(true);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      )
      .toBe(false);
    if (width === 390)
      await page.screenshot({ path: `${folder}/settings-mobile-${mode}.png` });
  }
  await scan(page, "mobile preferences");
  await page.keyboard.press("Escape");
  checks.push(
    "The banner/settings fit tablet and small phones; expired consent requests a fresh choice when providers are enabled",
  );

  await page.evaluate(() => {
    Storage.prototype.setItem = function () {
      throw new Error("Blocked storage");
    };
  });
  await settings.click();
  await page.getByRole("button", { name: "Reject optional" }).click();
  await expect(page.locator(".cookie-feedback[role=status]")).toContainText(
    "Your browser prevented saving",
  );
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".cookie-banner")).toHaveCount(0);
  checks.push(
    "Blocked browser storage preserves an in-memory choice and explains the persistence limit",
  );
  if (configured) {
    const fresh = await newContext();
    const freshPage = await fresh.newPage();
    await freshPage.goto(base + "/contact", { waitUntil: "networkidle" });
    await freshPage
      .getByRole("button", { name: "Accept all", exact: true })
      .click();
    await expect
      .poll(() => freshPage.evaluate(() => window.__mockAnalyticsScripts || 0))
      .toBeGreaterThanOrEqual(3);
    assert.equal(
      await freshPage.evaluate(
        () =>
          JSON.parse(localStorage.getItem("venizor-cookie-consent")).analytics,
      ),
      true,
    );
    await fresh.close();
    checks.push(
      "Accept all on a fresh visit enables only the configured, locally intercepted providers",
    );
  }
  assert.deepEqual(errors, []);
  await writeFile(
    `${folder}/verification-${mode}.json`,
    JSON.stringify(
      {
        mode,
        checks,
        requestsInterceptedLocally: requests,
        accessibility,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    `Cookie preferences passed (${mode}): ${checks.length} interaction groups; no live tracking requests sent.`,
  );
} finally {
  await browser.close();
}
