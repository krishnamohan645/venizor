import { deliverLead, deliveryReady, leadStore } from "@/lib/lead-delivery";
import { timingSafeEqual } from "node:crypto";
export const maxDuration = 60;
export async function GET(request: Request) {
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  const actual = request.headers.get("authorization") || "";
  if (
    !process.env.CRON_SECRET ||
    Buffer.byteLength(actual) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
  )
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!deliveryReady())
    return Response.json({ error: "Delivery not configured" }, { status: 503 });
  const ids = await leadStore().zrange<string[]>(
    "venizor:lead:pending",
    "-inf",
    Date.now(),
    { byScore: true, offset: 0, count: 10 },
  );
  const results = await Promise.all(ids.map((id) => deliverLead(id)));
  return Response.json({
    processed: results.length,
    emailed: results.filter((item) => item.emailed).length,
    pending: results.filter((item) => !item.crm).length,
  });
}
