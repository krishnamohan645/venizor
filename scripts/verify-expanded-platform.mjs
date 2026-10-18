import { chromium } from "@playwright/test";
import assert from "node:assert/strict";

const outDir = "C:/Users/lk645/.gemini/antigravity-ide/brain/0a702780-31fc-4616-b669-0023f407c159";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on("pageerror", (err) => errors.push(`Page error: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error" && /hydrat|server rendered|uncaught/i.test(msg.text())) {
      errors.push(`Console hydration error on ${page.url()}: ${msg.text()}`);
    }
  });

  // 1. Verify /playbook
  console.log("Checking /playbook...");
  const resPlaybook = await page.goto("http://localhost:3000/playbook", { waitUntil: "networkidle" });
  assert.equal(resPlaybook.status(), 200);
  assert.ok((await page.title()).includes("VENIZOR"));
  assert.ok(await page.locator(".score-number").textContent());
  await page.screenshot({ path: `${outDir}/page-playbook-desktop.png`, fullPage: true });

  // 2. Verify /simulator
  console.log("Checking /simulator...");
  const resSim = await page.goto("http://localhost:3000/simulator", { waitUntil: "networkidle" });
  assert.equal(resSim.status(), 200);
  await page.locator(".sim-trigger-btn").click();
  await page.waitForTimeout(1000);
  assert.ok(await page.locator(".terminal-line").count() >= 2);
  await page.screenshot({ path: `${outDir}/page-simulator-desktop.png`, fullPage: true });

  // 3. Verify /case-studies
  console.log("Checking /case-studies...");
  const resCases = await page.goto("http://localhost:3000/case-studies", { waitUntil: "networkidle" });
  assert.equal(resCases.status(), 200);
  assert.equal(await page.locator(".case-study-feature-card").count(), 4);
  await page.screenshot({ path: `${outDir}/page-cases-desktop.png`, fullPage: true });

  // 4. Verify /tools
  console.log("Checking /tools...");
  const resTools = await page.goto("http://localhost:3000/tools", { waitUntil: "networkidle" });
  assert.equal(resTools.status(), 200);
  assert.ok(await page.locator("code").count() >= 2);
  await page.screenshot({ path: `${outDir}/page-tools-desktop.png`, fullPage: true });

  // 5. Verify /scope
  console.log("Checking /scope...");
  const resScope = await page.goto("http://localhost:3000/scope", { waitUntil: "networkidle" });
  assert.equal(resScope.status(), 200);
  await page.locator("button", { hasText: "Continue to Capabilities" }).click();
  await page.waitForTimeout(300);
  assert.ok((await page.locator(".step-kicker").textContent()).includes("STEP 02"));
  await page.screenshot({ path: `${outDir}/page-scope-desktop.png`, fullPage: true });

  // 6. Verify /blog with new pipeline badges and SVG diagram
  console.log("Checking /blog diagram & pipeline badges...");
  await page.goto("http://localhost:3000/blog", { waitUntil: "networkidle" });
  assert.ok(await page.locator(".article-pipeline-strip").count() >= 1);
  await page.goto("http://localhost:3000/blog/connecting-third-party-https-apis", { waitUntil: "networkidle" });
  assert.ok(await page.locator(".blog-diagram-card").count() >= 1);
  assert.ok(await page.locator(".diagram-svg").count() >= 1);
  await page.screenshot({ path: `${outDir}/page-article-diagram-desktop.png`, fullPage: false });

  await page.close();

  assert.deepEqual(errors, []);
  console.log("All 5 interactive engineering pages & blog schematics verified with ZERO errors!");
} finally {
  await browser.close();
}
