export async function GET(request: Request) {
  // Reading the request keeps this endpoint dynamic with Cache Components enabled.
  void request.url;
  return Response.json(
    { status: "ok", time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
