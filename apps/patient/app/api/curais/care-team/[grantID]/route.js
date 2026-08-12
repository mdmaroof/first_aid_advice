import { NextResponse } from "next/server";
import { apiURL, bearerHeaders, sessionUser } from "@/lib/serverAuth";

export async function DELETE(_request, { params }) {
  try {
	const user = await sessionUser();
	if (!user) return NextResponse.json({ error: { message: "Sign in again." } }, { status: 401 });
    const response = await fetch(`${apiURL}/v1/patients/${user.id}/sharing-grants/${encodeURIComponent(params.grantID)}`, { method: "DELETE", headers: bearerHeaders(), cache: "no-store" });
    if (response.status === 204) return new NextResponse(null, { status: 204 });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ error: { code: "api_unavailable", message: "Start the Curais Go API and try again." } }, { status: 503 }); }
}
