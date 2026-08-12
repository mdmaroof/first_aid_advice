import { NextResponse } from "next/server";
import { apiURL, bearerHeaders } from "@/lib/serverAuth";

export async function GET(_request, { params }) {
  try { const response = await fetch(`${apiURL}/v1/doctor/patients/${encodeURIComponent(params.patientID)}/profile`, { headers: bearerHeaders(), cache: "no-store" }); return NextResponse.json(await response.json(), { status: response.status }); }
  catch { return NextResponse.json({ error: { code: "api_unavailable", message: "Start the Curais Go API and try again." } }, { status: 503 }); }
}
