/** Canonical site origin — no trailing slash. */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }

  // Auto-set by Vercel on deploy — do not add this to .env.local
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) {
    return `https://${vercelHost.replace(/\/+$/, "")}`;
  }

  return "https://www.snapaid.live";
}
