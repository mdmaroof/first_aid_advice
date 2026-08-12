/**
 * Simple in-memory sliding-window rate limiter (per serverless isolate).
 * Good enough to blunt casual abuse; not a substitute for edge WAF.
 */

const buckets = new Map();

export function rateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  let entry = buckets.get(key);

  if (!entry || now - entry.start >= windowMs) {
    entry = { start: now, count: 0 };
    buckets.set(key, entry);
  }

  entry.count += 1;

  if (entry.count > limit) {
    const retryAfterSec = Math.ceil((windowMs - (now - entry.start)) / 1000);
    return { ok: false, retryAfterSec };
  }

  return { ok: true, remaining: limit - entry.count };
}

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
