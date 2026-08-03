import { NextResponse } from "next/server";
import { getEmergencyForCountry } from "@/data/emergencyNumbers";

async function lookupCountryFromIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  // Private / local addresses — skip external lookup
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
  ) {
    return null;
  }

  try {
    const url = ip
      ? `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode`
      : "http://ip-api.com/json/?fields=status,countryCode";

    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.status === "success" && data.countryCode) {
      return data.countryCode;
    }
  } catch {
    // Fall through to default emergency number
  }

  return null;
}

export async function GET(request) {
  const headerCountry =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");

  const countryCode =
    headerCountry && headerCountry !== "XX"
      ? headerCountry
      : await lookupCountryFromIp(request);

  const emergency = getEmergencyForCountry(countryCode);

  return NextResponse.json(emergency, {
    headers: {
      "Cache-Control": "private, max-age=3600",
    },
  });
}
