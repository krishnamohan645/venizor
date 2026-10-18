import { getSearchIndex } from "@/lib/search-index";

export function GET() {
  return Response.json(
    { entries: getSearchIndex() },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
