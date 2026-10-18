import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";

const port = process.env.TEST_PORT || "3100";
const base = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--port",
    port,
    "--hostname",
    "127.0.0.1",
  ],
  { stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
);
let output = "";
server.stdout.on("data", (chunk) => {
  output += chunk;
});
server.stderr.on("data", (chunk) => {
  output += chunk;
});
try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null)
      throw new Error(output || "Preview server exited unexpectedly");
    try {
      const response = await fetch(base + "/api/health", {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await setTimeout(250);
  }
  if (!ready) throw new Error("Preview server did not become ready. " + output);
  const scripts =
    process.argv.length > 2
      ? process.argv.slice(2)
      : ["scripts/verify-production.mjs"];
  for (const script of scripts) {
    const checker = spawn(process.execPath, [script], {
      env: { ...process.env, TEST_BASE_URL: base },
      stdio: "inherit",
      windowsHide: true,
    });
    const code = await new Promise((resolve, reject) => {
      checker.once("error", reject);
      checker.once("exit", resolve);
    });
    if (code !== 0) {
      process.exitCode = typeof code === "number" ? code : 1;
      break;
    }
  }
} finally {
  server.kill();
}
