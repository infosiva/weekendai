// Removed insecure http:// stats fetch; no client uses this route.
export async function GET() {
  return Response.json({ visitors: null }, { status: 200 })
}
