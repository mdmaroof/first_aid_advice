import { NextResponse } from "next/server";
import { apiURL, bearerHeaders } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";
export async function GET(request) {
  try { const query = new URL(request.url).searchParams.get("query") || ""; const response = await fetch(`${apiURL}/v1/doctor/patients?query=${encodeURIComponent(query)}`, { headers: bearerHeaders(), cache: "no-store" }); return NextResponse.json(await response.json(), { status: response.status }); }
  catch { return NextResponse.json({ error: { code: "api_unavailable", message: "Start the Curais Go API and try again." } }, { status: 503 }); }
}
