import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiURL, sessionCookie, sessionToken } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const action = params.action;
  if (!["signin", "signup", "signout"].includes(action)) return NextResponse.json({ error: { message: "Unknown action." } }, { status: 404 });
  const token = sessionToken();
  try {
    const body = action === "signout" ? undefined : { ...(await request.json()), role: "patient" };
    const response = await fetch(`${apiURL}/v1/auth/${action}`, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
    if (action === "signout") {
      cookies().delete(sessionCookie);
      return new NextResponse(null, { status: 204 });
    }
    const payload = await response.json();
    if (response.ok) cookies().set(sessionCookie, payload.token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: new Date(payload.expiresAt) });
    return NextResponse.json(response.ok ? { user: payload.user } : payload, { status: response.status });
  } catch { return NextResponse.json({ error: { code: "api_unavailable", message: "Start the Curais API and try again." } }, { status: 503 }); }
}
