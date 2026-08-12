import { NextResponse } from "next/server";
import { getEmergencyForCountry } from "@/data/emergencyNumbers";

function isPrivateIp(ip) {
  if (!ip) return true;

  const lower = ip.toLowerCase();
  if (
    lower === "127.0.0.1" ||
    lower === "::1" ||
    lower === "0:0:0:0:0:0:0:1" ||
    lower === "localhost"
  ) {
    return true;
  }

  if (lower.startsWith("10.")) return true;
  if (lower.startsWith("192.168.")) return true;
  if (lower.startsWith("169.254.")) return true;
  if (lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80:")) {
    return true;
  }

  const match = lower.match(/^172\.(\d+)\./);
  if (match) {
    const second = Number(match[1]);
    if (second >= 16 && second <= 31) return true;
  }

  return false;
}

async function lookupCountryFromIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  if (isPrivateIp(ip)) {
    return null;
  }

  try {
    const url = `https://ipapi.co/${encodeURIComponent(ip)}/country_code/`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      headers: { Accept: "text/plain" },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const code = (await res.text()).trim().toUpperCase();
    if (code && code.length === 2 && code !== "XX") {
      return code;
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
