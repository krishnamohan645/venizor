import { chromium } from "@playwright/test";

const outDir = "C:/Users/lk645/.gemini/antigravity-ide/brain/0a702780-31fc-4616-b669-0023f407c159";
const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Careers Page
  console.log("Capturing /careers...");
  await page.goto("http://localhost:3000/careers", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/showcase-careers-desktop.png`, fullPage: false });

  // 2. Blog Post: Superintelligence ASI with Diagram & Dev.to dock
  console.log("Capturing /blog/the-race-to-superintelligence-asi-hardware-frontiers...");
  await page.goto("http://localhost:3000/blog/the-race-to-superintelligence-asi-hardware-frontiers", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/showcase-asi-blog.png`, fullPage: false });

  // 3. Blog Post: Big Tech Architecture Teardown (Uber, Google, Anthropic)
  console.log("Capturing /blog/how-big-tech-engineers-hyper-scale-apps...");
  await page.goto("http://localhost:3000/blog/how-big-tech-engineers-hyper-scale-apps", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/showcase-bigtech-blog.png`, fullPage: false });

  // 4. Home Page: ReactBits 3D Circular Carousel
  console.log("Capturing Circular Carousel...");
  await page.goto("http://localhost:3000/#projects", { waitUntil: "networkidle" });
  const carousel = page.locator(".circular-carousel-wrapper");
  await carousel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/showcase-3d-carousel.png`, fullPage: false });

  // 5. Home Page: Sticky Stacking Section
  console.log("Capturing Sticky Stacking Section...");
  const stack = page.locator(".sticky-stack-wrapper");
  await stack.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/showcase-sticky-stack.png`, fullPage: false });

  console.log("Screenshots captured successfully!");
} finally {
  await browser.close();
}
