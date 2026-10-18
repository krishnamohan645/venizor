import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const folder = "artifacts/playbook";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({
  ...(process.platform === "win32" ? { channel: "chrome" } : {}),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const checks = [],
  errors = [],
  accessibility = [];
page.on("pageerror", (error) => errors.push(error.message));
async function scan(label) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  accessibility.push({
    label,
    violations: results.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map((node) => node.target),
    })),
  });
  assert.equal(results.violations.length, 0, JSON.stringify(accessibility));
}
try {
  assert.equal(
    (
      await page.goto(base + "/playbook", { waitUntil: "networkidle" })
    ).status(),
    200,
  );
  await expect(
    page.getByRole("heading", { name: "Good systems. Start here." }),
  ).toBeVisible();
  await scan("initial");
  await page.getByRole("button", { name: /AI workspace Information/ }).click();
  await expect(
    page.getByRole("button", { name: "Edit Intelligence: Managed model APIs" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Evaluate the AI workflow" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Connected app Keep/ }).click();
  await expect(
    page.getByRole("button", { name: "Edit Experience: React Native / Expo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Handle reconnects" }),
  ).toBeVisible();
  checks.push(
    "Starting presets update selections, blueprint and review questions",
  );

  await page.getByRole("button", { name: "Reset stack" }).click();
  const experience = page.getByRole("tab", { name: "01 Experience" });
  await page.getByRole("button", { name: "Next layer" }).click();
  await expect(
    page.getByRole("tab", { name: "02 Application" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(experience).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("button", { name: "Edit Data: PostgreSQL / pgvector" })
    .click();
  await expect(page.getByRole("tab", { name: "03 Data" })).toBeFocused();
  await experience.click();
  await experience.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "02 Application" })).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "06 Connections" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(experience).toBeFocused();
  await page.getByRole("radio", { name: /Next.js/ }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("radio", { name: /Vite/ })).toBeChecked();
  await expect(
    page.getByRole("button", { name: "Edit Experience: Vite + React" }),
  ).toBeVisible();
  checks.push(
    "Arrow/Home/End tab navigation and native radio keyboard selection work",
  );

  for (const [tab, option, review] of [
    ["02 Application", /gRPC/, "Plan the client boundary"],
    ["03 Data", /Redis \/ Upstash/, "Plan durable storage"],
    ["04 Intelligence", /Self-hosted/, "Evaluate the AI workflow"],
    ["05 Delivery", /GitHub Actions/, "Choose a hosting target"],
  ]) {
    await page.getByRole("tab", { name: tab }).click();
    await page.getByRole("radio", { name: option }).check();
    await expect(page.getByRole("heading", { name: review })).toBeVisible();
  }
  await page.getByRole("tab", { name: "06 Connections" }).click();
  await page.getByRole("checkbox", { name: /Stripe/ }).uncheck();
  await page.getByRole("checkbox", { name: /Resend/ }).uncheck();
  await expect(
    page.getByText("No external connections selected."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Keep connections intentional" }),
  ).toBeVisible();
  await scan("custom stack with empty integrations");
  await experience.click();
  await expect(page.getByRole("radio", { name: /Vite/ })).toBeChecked();
  checks.push(
    "Every layer persists its selection; review reflects gRPC, cache, AI, pipeline and empty connections",
  );

  await page.getByRole("button", { name: "Copy your stack brief" }).click();
  await expect(
    page.getByRole("button", { name: "Brief copied" }),
  ).toBeVisible();
  const copied = (
    await page.evaluate(() => navigator.clipboard.readText())
  ).replace(/\r\n/g, "\n");
  assert.match(copied, /Experience: Vite \+ React/);
  assert.match(copied, /Connections: None selected/);
  assert.match(copied, /Choose a hosting target/);
  assert.doesNotMatch(copied, /96%|20,000|45ms/);
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: () => Promise.reject(new Error("Access denied")),
    }),
  );
  await page.getByRole("button", { name: "Brief copied" }).click();
  const fallback = page.getByRole("textbox", {
    name: "Architecture brief to copy",
  });
  await expect(fallback).toHaveValue(copied);
  await fallback.focus();
  assert.equal(
    await fallback.evaluate((el) => el.selectionEnd - el.selectionStart),
    copied.length,
  );
  await scan("clipboard fallback");
  checks.push(
    "Clipboard success waits for acknowledgement; denial exposes a selectable brief",
  );

  await page.getByRole("button", { name: "Reset stack" }).click();
  await expect(page.getByRole("radio", { name: /Next.js/ })).toBeChecked();
  await expect(
    page.getByRole("button", { name: /Web product A useful/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(fallback).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Plan durable storage" }),
  ).toHaveCount(0);
  checks.push(
    "Reset restores the starting stack and clears stale copy/review state",
  );

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.getByRole("tab", { name: "02 Application" }).click();
    await expect(page.getByRole("radio", { name: /Node.js/ })).toBeVisible();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Overflow at ${width}`,
    );
    if ([1440, 390].includes(width)) {
      await experience.click();
      await page.screenshot({
        path: `${folder}/playbook-${width}.png`,
        fullPage: true,
      });
      await page
        .locator(".pb-workspace")
        .screenshot({ path: `${folder}/workspace-${width}.png` });
    }
  }
  await scan("mobile");
  checks.push(
    "Five responsive widths fit; mobile tabs and choices remain operable",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await experience.click();
  await page.getByRole("tab", { name: "04 Intelligence" }).click();
  await expect(
    page.getByRole("heading", { name: "Make intelligence useful." }),
  ).toBeVisible();
  await page.getByRole("radio", { name: /Managed model APIs/ }).check();
  await expect(
    page.getByRole("button", { name: "Edit Intelligence: Managed model APIs" }),
  ).toBeVisible();
  checks.push(
    "Animated transitions settle on the selected layer; reduced-motion workflow also passes",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    `${folder}/verification.json`,
    JSON.stringify({ checks, accessibility, errors }, null, 2),
  );
  console.log(
    `Playbook passed: ${checks.length} interaction groups, ${accessibility.length} accessibility scans, five viewport widths.`,
  );
} finally {
  await browser.close();
}
