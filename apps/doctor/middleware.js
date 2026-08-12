import { NextResponse } from "next/server";

export function middleware(request) {
  if (!request.cookies.get("curais_doctor_session")?.value) return NextResponse.redirect(new URL(`/signin?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/", "/patients/:path*"] };
