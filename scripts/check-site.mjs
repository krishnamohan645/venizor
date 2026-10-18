import assert from "node:assert/strict";
const base = process.env.MONITOR_SITE_URL;
if (!base || !/^https:\/\//.test(base)) throw new Error("Set MONITOR_SITE_URL to the production HTTPS URL.");
for (const route of ["/", "/contact", "/blog", "/api/health"]) {
  const response = await fetch(base.replace(/\/$/, "") + route, { signal: AbortSignal.timeout(20000), redirect: "follow" });
  assert.equal(response.status, 200, `${route} unavailable`);
  if (route === "/api/health") {
    const health = await response.json(); assert.equal(health.status, "ok");
    assert.ok(Math.abs(Date.now() - new Date(health.time).getTime()) < 120000, "Health response is stale");
  }
}
console.log("Public route and health checks passed.");
