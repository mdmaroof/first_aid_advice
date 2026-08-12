import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const apiURL = process.env.CURAIS_API_URL || "http://127.0.0.1:8080";
const doctorHeaders = { "X-Curais-Actor-ID": "doctor-local-1", "X-Curais-Actor-Role": "doctor" };

export async function GET(request) {
  try { const query = new URL(request.url).searchParams.get("query") || ""; const response = await fetch(`${apiURL}/v1/doctor/patients?query=${encodeURIComponent(query)}`, { headers: doctorHeaders, cache: "no-store" }); return NextResponse.json(await response.json(), { status: response.status }); }
  catch { return NextResponse.json({ error: { code: "api_unavailable", message: "Start the Curais Go API and try again." } }, { status: 503 }); }
}
