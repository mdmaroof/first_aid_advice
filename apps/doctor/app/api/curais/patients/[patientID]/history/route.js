import { NextResponse } from "next/server";
import { apiURL, bearerHeaders } from "@/lib/serverAuth";
async function forward(method, patientID, body) { try { const response = await fetch(`${apiURL}/v1/doctor/patients/${encodeURIComponent(patientID)}/history`, { method, headers: bearerHeaders({ "Content-Type": "application/json" }), body: body ? JSON.stringify(body) : undefined, cache: "no-store" }); return NextResponse.json(await response.json(), { status: response.status }); } catch { return NextResponse.json({ error: { message: "API unavailable." } }, { status: 503 }); } }
export async function GET(_request, { params }) { return forward("GET", params.patientID); }
export async function POST(request, { params }) { return forward("POST", params.patientID, await request.json()); }
