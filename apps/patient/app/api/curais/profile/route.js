import { NextResponse } from "next/server";
import { apiURL, bearerHeaders, sessionUser } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

async function forward(method, body) {
  try {
	const user = await sessionUser();
	if (!user) return NextResponse.json({ error: { code: "unauthenticated", message: "Sign in again." } }, { status: 401 });
    const response = await fetch(`${apiURL}/v1/patients/${user.id}/profile`, {
      method,
      headers: bearerHeaders({ "Content-Type": "application/json" }),
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({ error: { code: "invalid_api_response", message: "The Curais API returned an invalid response." } }));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ error: { code: "api_unavailable", message: "Start the Curais Go API on port 8080 and try again." } }, { status: 503 });
  }
}

export async function GET() { return forward("GET"); }
export async function PUT(request) { return forward("PUT", await request.json()); }
