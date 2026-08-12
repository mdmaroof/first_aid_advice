import { NextResponse } from "next/server";

const apiURL = process.env.CURAIS_API_URL || "http://127.0.0.1:8080";

export async function GET(_request, { params }) {
  try { const response = await fetch(`${apiURL}/v1/doctor/patients/${encodeURIComponent(params.patientID)}/profile`, { headers: { "X-Curais-Actor-ID": "doctor-local-1", "X-Curais-Actor-Role": "doctor" }, cache: "no-store" }); return NextResponse.json(await response.json(), { status: response.status }); }
  catch { return NextResponse.json({ error: { code: "api_unavailable", message: "Start the Curais Go API and try again." } }, { status: 503 }); }
}
