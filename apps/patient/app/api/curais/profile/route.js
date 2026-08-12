import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const apiURL = process.env.CURAIS_API_URL || "http://127.0.0.1:8080";
const localPatientID = "patient-local-1";

function headers() {
  return {
    "Content-Type": "application/json",
    "X-Curais-Actor-ID": localPatientID,
    "X-Curais-Actor-Role": "patient",
  };
}

async function forward(method, body) {
  try {
    const response = await fetch(`${apiURL}/v1/patients/${localPatientID}/profile`, {
      method,
      headers: headers(),
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
