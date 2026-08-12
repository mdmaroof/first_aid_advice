import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === "/search") {
    return NextResponse.redirect(new URL("/immediate-care/search", request.url));
  }
  if (pathname === "/patient/snapaid" || pathname.startsWith("/patient/snapaid/")) {
    const suffix = pathname.slice("/patient/snapaid".length);
    return NextResponse.redirect(new URL(`/immediate-care${suffix}`, request.url));
  }
  const signedIn = Boolean(request.cookies.get("curais_patient_session")?.value);
  if (!signedIn) return NextResponse.redirect(new URL(`/signin?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/patient/:path*", "/search"] };
