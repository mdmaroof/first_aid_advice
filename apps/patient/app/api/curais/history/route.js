import { NextResponse } from "next/server";
import { apiURL, bearerHeaders, sessionUser } from "@/lib/serverAuth";

async function forward(method, body) {
  try { const user = await sessionUser(); if (!user) return NextResponse.json({ error: { message: "Sign in again." } }, { status: 401 }); const response = await fetch(`${apiURL}/v1/patients/${user.id}/history`, { method, headers: bearerHeaders({ "Content-Type": "application/json" }), body: body ? JSON.stringify(body) : undefined, cache: "no-store" }); return NextResponse.json(await response.json(), { status: response.status }); }
  catch { return NextResponse.json({ error: { message: "Start the Curais API and try again." } }, { status: 503 }); }
}
export async function GET() { return forward("GET"); }
export async function POST(request) { return forward("POST", await request.json()); }
