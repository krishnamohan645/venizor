import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('artifacts/references', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const [name, url] of [
  ['monoform', 'https://monoform-template.webflow.io'],
  ['deluix', 'https://deluix.webflow.io'],
  ['nexbit', 'https://nexbitstudio.webflow.io'],
  ['nocturns', 'https://nocturns-portfolio-template.webflow.io'],
]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `artifacts/references/${name}.png` });
    console.log(JSON.stringify({ name, title: await page.title(), headings: await page.locator('h1,h2').allTextContents() }));
  } catch (error) { console.log(JSON.stringify({ name, error: error.message.slice(0, 200) })); }
  await page.close();
}
await browser.close();
