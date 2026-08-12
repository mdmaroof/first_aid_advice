const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteURL}/sitemap.xml`,
  };
}
