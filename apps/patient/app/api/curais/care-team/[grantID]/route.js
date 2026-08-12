import { NextResponse } from "next/server";

const apiURL = process.env.CURAIS_API_URL || "http://127.0.0.1:8080";
const patientID = "patient-local-1";

export async function DELETE(_request, { params }) {
  try {
    const response = await fetch(`${apiURL}/v1/patients/${patientID}/sharing-grants/${encodeURIComponent(params.grantID)}`, { method: "DELETE", headers: { "X-Curais-Actor-ID": patientID, "X-Curais-Actor-Role": "patient" }, cache: "no-store" });
    if (response.status === 204) return new NextResponse(null, { status: 204 });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ error: { code: "api_unavailable", message: "Start the Curais Go API and try again." } }, { status: 503 }); }
}
