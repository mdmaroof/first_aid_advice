const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

export default function sitemap() {
  return [
    { url: siteURL, changeFrequency: "weekly", priority: 1 },
    { url: `${siteURL}/privacy`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteURL}/terms`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
