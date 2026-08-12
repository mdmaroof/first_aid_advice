import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const apiURL = process.env.CURAIS_API_URL || "http://127.0.0.1:8080";
const patientID = "patient-local-1";
const identityHeaders = { "Content-Type": "application/json", "X-Curais-Actor-ID": patientID, "X-Curais-Actor-Role": "patient" };

async function forward(path, options = {}) {
  try {
    const response = await fetch(`${apiURL}${path}`, { ...options, headers: { ...identityHeaders, ...(options.headers || {}) }, cache: "no-store" });
    if (response.status === 204) return new NextResponse(null, { status: 204 });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ error: { code: "api_unavailable", message: "Start the Curais Go API and try again." } }, { status: 503 }); }
}

export async function GET() { return forward(`/v1/patients/${patientID}/care-team`); }
export async function POST(request) { return forward(`/v1/patients/${patientID}/sharing-grants`, { method: "POST", body: JSON.stringify(await request.json()) }); }
