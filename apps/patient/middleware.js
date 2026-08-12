import { NextResponse } from "next/server";

export function middleware(request) {
  const signedIn = Boolean(request.cookies.get("curais_patient_session")?.value);
  if (!signedIn) return NextResponse.redirect(new URL(`/signin?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/patient/:path*", "/search"] };
