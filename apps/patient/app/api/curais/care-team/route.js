import { NextResponse } from "next/server";
import { apiURL, bearerHeaders, sessionUser } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";
async function forward(path, options = {}) {
  try {
    const response = await fetch(`${apiURL}${path}`, { ...options, headers: bearerHeaders({ "Content-Type": "application/json", ...(options.headers || {}) }), cache: "no-store" });
    if (response.status === 204) return new NextResponse(null, { status: 204 });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ error: { code: "api_unavailable", message: "Start the Curais Go API and try again." } }, { status: 503 }); }
}

async function patientID() { return (await sessionUser())?.id; }
export async function GET() { const id = await patientID(); return id ? forward(`/v1/patients/${id}/care-team`) : NextResponse.json({ error: { message: "Sign in again." } }, { status: 401 }); }
export async function POST(request) { const id = await patientID(); return id ? forward(`/v1/patients/${id}/sharing-grants`, { method: "POST", body: JSON.stringify(await request.json()) }) : NextResponse.json({ error: { message: "Sign in again." } }, { status: 401 }); }
