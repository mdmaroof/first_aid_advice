import { NextResponse } from "next/server";
import { apiURL, bearerHeaders } from "@/lib/serverAuth";

const allowed = new Set(["dashboard", "appointments", "encounters", "prescriptions", "labs"]);
async function forward(method, resource, body) {
  if (!allowed.has(resource)) return NextResponse.json({ error: { message: "Unknown EMR resource." } }, { status: 404 });
  try { const response = await fetch(`${apiURL}/v1/doctor/${resource}`, { method, headers: bearerHeaders({ "Content-Type": "application/json" }), body: body ? JSON.stringify(body) : undefined, cache: "no-store" }); const payload = await response.json().catch(() => ({})); return NextResponse.json(payload, { status: response.status }); }
  catch { return NextResponse.json({ error: { message: "Start the Curais API and try again." } }, { status: 503 }); }
}
export async function GET(_request, { params }) { return forward("GET", params.resource); }
export async function POST(request, { params }) { return forward("POST", params.resource, await request.json()); }
