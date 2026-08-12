import { Mulish, Quicksand } from "next/font/google";
import { Providers } from "@/components/Providers";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const fontTwo = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });
const fontOne = Mulish({ subsets: ["latin"], variable: "--font-mulish" });

const siteUrl = getSiteUrl();

const title = "SnapAid — Instant First Aid Guidance";
const description =
  "Get clear, step-by-step first aid for chest pain, bleeding, burns, choking, bites, and more. SnapAid helps you act fast in an emergency — not a substitute for professional medical care.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | SnapAid",
  },
  description,
  applicationName: "SnapAid",
  keywords: [
    "first aid",
    "first aid steps",
    "emergency first aid",
    "CPR guidance",
    "choking first aid",
    "bleeding control",
    "burn treatment",
    "snake bite first aid",
    "dog bite wound care",
    "chest pain what to do",
    "breathing difficulty",
    "Heimlich manoeuvre",
    "emergency number",
    "medical emergency help",
    "SnapAid",
  ],
  authors: [{ name: "Mohd Maroof" }],
  creator: "Mohd Maroof | Snapaid",
  publisher: "Mohd Maroof | Snapaid",
  category: "health",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SnapAid",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  appleWebApp: {
    capable: true,
    title: "SnapAid",
    statusBarStyle: "default",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#c5e0e4" },
    { media: "(prefers-color-scheme: dark)", color: "#0A6B6F" },
  ],
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SnapAid",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  description,
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  about: {
    "@type": "Thing",
    name: "First aid",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${fontOne.variable} ${fontTwo.variable} ${fontOne.className}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
