import { cookies } from "next/headers";

export const sessionCookie = "curais_patient_session";
export const apiURL = process.env.CURAIS_API_URL || "http://127.0.0.1:8080";

export function sessionToken() { return cookies().get(sessionCookie)?.value || ""; }
export function bearerHeaders(extra = {}) {
  const token = sessionToken();
  return { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra };
}
export async function sessionUser() {
  const token = sessionToken();
  if (!token) return null;
  const response = await fetch(`${apiURL}/v1/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()).user;
}
