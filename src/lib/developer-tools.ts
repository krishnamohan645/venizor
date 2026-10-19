export async function signWebhook(
  payload: string,
  secret: string,
  timestamp: string,
) {
  JSON.parse(payload);
  if (!secret.trim()) throw new Error("Enter a signing secret.");
  if (!/^\d{1,12}$/.test(timestamp))
    throw new Error("Enter a valid Unix timestamp in seconds.");
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const [signature, digest] = await Promise.all([
    crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`)),
    crypto.subtle.digest("SHA-256", encoder.encode(payload)),
  ]);
  const hex = (buffer: ArrayBuffer) =>
    Array.from(new Uint8Array(buffer), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  return {
    signature: `t=${timestamp},v1=${hex(signature)}`,
    digest: hex(digest),
  };
}
export type TokenInputs = {
  queries: number;
  input: number;
  output: number;
  inputRate: number;
  outputRate: number;
  cache: number;
};
export function estimateTokens(values: TokenInputs) {
  const calls = values.queries * (1 - values.cache / 100);
  const inputCost = ((calls * values.input) / 1_000_000) * values.inputRate;
  const outputCost = ((calls * values.output) / 1_000_000) * values.outputRate;
  const uncached =
    (values.queries *
      (values.input * values.inputRate + values.output * values.outputRate)) /
    1_000_000;
  return {
    calls,
    inputCost,
    outputCost,
    total: inputCost + outputCost,
    saved: uncached - inputCost - outputCost,
  };
}
export function createSecurityHeaders(options: {
  hsts: boolean;
  noSniff: boolean;
  frames: boolean;
  csp: boolean;
}) {
  return [
    ...(options.hsts
      ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
      : []),
    ...(options.noSniff
      ? [{ key: "X-Content-Type-Options", value: "nosniff" }]
      : []),
    ...(options.frames ? [{ key: "X-Frame-Options", value: "DENY" }] : []),
    ...(options.csp
      ? [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
          },
        ]
      : []),
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
  ];
}
