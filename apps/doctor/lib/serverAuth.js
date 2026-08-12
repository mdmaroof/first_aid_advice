import { cookies } from "next/headers";

export const sessionCookie = "curais_doctor_session";
export const apiURL = process.env.CURAIS_API_URL || "http://127.0.0.1:8080";
export function sessionToken() { return cookies().get(sessionCookie)?.value || ""; }
export function bearerHeaders(extra = {}) { const token = sessionToken(); return { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra }; }
