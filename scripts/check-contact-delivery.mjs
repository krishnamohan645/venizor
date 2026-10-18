import assert from "node:assert/strict";
const base = process.env.MONITOR_SITE_URL;
const secret = process.env.SYNTHETIC_CONTACT_SECRET;
if (!base || !secret || !process.env.CONTACT_TEST_TO_EMAIL) throw new Error("Synthetic delivery is not configured. Set MONITOR_SITE_URL, SYNTHETIC_CONTACT_SECRET and CONTACT_TEST_TO_EMAIL.");
const response = await fetch(base.replace(/\/$/, "") + "/api/contact", {
  method: "POST", headers: { "Content-Type": "application/json", "x-synthetic-secret": secret },
  body: JSON.stringify({ requestId: crypto.randomUUID(), name: "VENIZOR delivery monitor", email: process.env.CONTACT_TEST_TO_EMAIL, service: "Synthetic delivery test", source: "contact", message: "Scheduled synthetic contact delivery test. No real visitor data.", test: true }), signal: AbortSignal.timeout(30000),
});
assert.equal(response.status, 200, `Synthetic provider acceptance failed (${response.status})`);
const result = await response.json(); assert.ok(result.ok && result.reference);
console.log("Synthetic message accepted by email provider. Confirm inbox receipt through your monitoring mailbox integration.");
