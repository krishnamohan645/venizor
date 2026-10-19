import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash, createHmac } from "node:crypto";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://localhost:3000",
  folder = "artifacts/polish";
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
page.setDefaultTimeout(10000);
const checks = [],
  errors = [],
  accessibility = [];
page.on("pageerror", (error) => errors.push(error.message));
async function axe(label) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  accessibility.push({ label, violations: result.violations });
  assert.equal(
    result.violations.length,
    0,
    JSON.stringify({ label, violations: result.violations }),
  );
}
async function tool(name) {
  await page.getByRole("button", { name: new RegExp(name) }).click();
}
try {
  await page.goto(base + "/tools", { waitUntil: "networkidle" });
  await expect(page.locator(".brand-logo img")).toHaveAttribute(
    "src",
    "/logo.svg",
  );
  assert.equal(await page.locator(".cursor-follower").count(), 0);
  await page
    .locator(".tools-opening")
    .screenshot({ path: `${folder}/tools-opening.png` });
  await page
    .getByLabel("JSON payload", { exact: false })
    .fill('{"message":"hello 🌍"}');
  await page
    .getByLabel("Signing secret", { exact: true })
    .fill("example_secret");
  await page.getByLabel("Unix timestamp", { exact: false }).fill("1729267200");
  await page.getByRole("button", { name: "Generate signature" }).click();
  await expect(page.getByLabel("HMAC signature header")).toHaveValue(
    `t=1729267200,v1=${createHmac("sha256", "example_secret").update('1729267200.{"message":"hello 🌍"}').digest("hex")}`,
  );
  const digest = createHash("sha256")
    .update('{"message":"hello 🌍"}')
    .digest("hex");
  await expect(page.getByLabel("Payload SHA-256 digest")).toHaveValue(digest);
  await page
    .locator(".tool-output-field")
    .nth(1)
    .getByRole("button", { name: "Copy" })
    .click();
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    digest,
  );
  await page
    .locator(".tools-bench")
    .screenshot({ path: `${folder}/tools-webhook.png` });
  await axe("Webhook lab");
  await page.getByLabel("JSON payload", { exact: false }).fill("{");
  await page.getByRole("button", { name: "Generate signature" }).click();
  await expect(page.locator(".tool-panel").getByRole("alert")).toContainText(
    "not valid JSON",
  );
  checks.push(
    "Webhook tool generates genuine HMAC/SHA-256, copies output and reports malformed JSON",
  );

  await tool("LLM Token & Cost Calculator");
  for (const [label, value] of [
    ["Monthly requests", "1000000"],
    ["Input tokens / request", "1000"],
    ["Output tokens / request", "100"],
    ["Input rate", "2"],
    ["Output rate", "10"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByLabel("Cache hit rate", { exact: false }).focus();
  await page.keyboard.press("Home");
  for (let i = 0; i < 25; i++) await page.keyboard.press("ArrowRight");
  await expect(page.locator(".token-total")).toHaveText("$2,250.00");
  await page
    .locator(".tools-bench")
    .screenshot({ path: `${folder}/tools-budget.png` });
  await axe("Token budget");
  checks.push(
    "Editable rates, token counts and cache percentage produce the expected monthly estimate",
  );

  await tool("Security Headers & CSP Generator");
  await expect(page.locator(".tool-code")).toContainText(
    "Content-Security-Policy",
  );
  await page.getByRole("checkbox", { name: /Add a content policy/ }).uncheck();
  await expect(page.locator(".tool-code")).not.toContainText(
    "Content-Security-Policy",
  );
  await expect(page.locator(".tool-code")).toContainText("Referrer-Policy");
  await page
    .locator(".tool-result")
    .getByRole("button", { name: "Copy", exact: true })
    .click();
  assert.ok(
    (await page.evaluate(() => navigator.clipboard.readText())).includes(
      "Strict-Transport-Security",
    ),
  );
  await page
    .locator(".tools-bench")
    .screenshot({ path: `${folder}/tools-headers.png` });
  await axe("Header builder");
  checks.push(
    "Header toggles update the exported configuration and clipboard contents",
  );

  for (const width of [320, 390, 720, 768, 960, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(120);
    const header = await page.getByRole("banner").evaluate((node) => {
      const b = node.querySelector(".brand-logo").getBoundingClientRect(),
        a = node
          .querySelector(".studio-header-actions")
          .getBoundingClientRect();
      return {
        right: a.right,
        left: a.left,
        logoRight: b.right,
        width: innerWidth,
      };
    });
    assert.ok(
      header.right <= width && header.left > header.logoRight,
      JSON.stringify({ width, header }),
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Tools overflow ${width}`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of ["Webhook Signature", "LLM Token", "Security Headers"]) {
    await tool(name);
    await axe(`Mobile ${name}`);
  }
  await page
    .locator(".tools-bench")
    .screenshot({ path: `${folder}/tools-mobile.png` });
  checks.push(
    "Tools and visible search/menu controls fit seven viewport widths; all mobile tool states pass accessibility checks",
  );

  for (const route of ["/tools", "/contact", "/about"]) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    const footer = page.locator(".page-inner-footer");
    assert.equal(
      await footer.evaluate((el) => getComputedStyle(el).backgroundColor),
      "rgb(244, 247, 253)",
    );
    await expect(page.locator(".brand-logo img")).toHaveAttribute(
      "src",
      "/logo.svg",
    );
    assert.equal(await page.locator(".cursor-follower").count(), 0);
  }
  await page
    .locator("footer")
    .screenshot({ path: `${folder}/light-footer.png` });
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".footer-shader").count(), 1);
  assert.ok(
    await page
      .locator(".studio-footer-home")
      .evaluate((el) =>
        getComputedStyle(el).backgroundImage.includes("gradient"),
      ),
  );
  assert.equal(await page.locator(".cursor-follower").count(), 0);
  await expect(page.locator(".service-description > p").first()).toHaveCSS(
    "font-size",
    "18px",
  );
  await page.screenshot({ path: `${folder}/home-mobile.png` });
  await page.setViewportSize({ width: 1440, height: 1000 });
  const gallery = page.locator(".project-scroll-section");
  for (let i = 0; i < 4; i++) {
    await gallery.getByRole("tab").nth(i).click();
    await expect(gallery).toHaveAttribute("data-active-project", String(i));
    await page
      .locator(".project-slide[data-active=true]")
      .screenshot({ path: `${folder}/project-${i + 1}.png` });
  }
  const scenes = await gallery
    .locator(".scene-artwork > .section-illustration")
    .evaluateAll((nodes) => nodes.map((node) => node.className));
  assert.equal(new Set(scenes).size, 4);
  checks.push(
    "Inner footers are light, the home gradient remains, the SVG logo is shared, custom cursor is removed and four project visuals are distinct",
  );
  await page.goto(base + "/blog", { waitUntil: "networkidle" });
  const coverBounds = await page.locator(".article-art").evaluateAll((nodes) =>
    nodes.map((node) => ({
      art: node.querySelector("svg").getBoundingClientRect().bottom,
      caption: node
        .querySelector(".editorial-cover-meta")
        .getBoundingClientRect().top,
    })),
  );
  assert.ok(
    coverBounds.every(({ art, caption }) => art <= caption + 1),
    JSON.stringify(coverBounds),
  );
  await page
    .locator(".journal-article")
    .first()
    .screenshot({ path: `${folder}/blog-card.png` });
  checks.push(
    "Blog illustrations stay inside their artwork frames and clear of captions",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    `${folder}/verification.json`,
    JSON.stringify({ checks, accessibility, errors }, null, 2),
  );
  console.log(
    JSON.stringify(
      { checks, accessibilityScans: accessibility.length, errors },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
