import { Mulish, Quicksand } from "next/font/google";
import { Providers } from "../components/Providers";
import "./globals.css";

const mulish = Mulish({ subsets: ["latin"], variable: "--font-mulish", display: "swap" });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand", display: "swap" });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000"),
  title: { default: "Curais — Clear help now. Better care next.", template: "%s | Curais" },
  description: "Immediate first-aid guidance, a patient-controlled health record, connected family context, and consent-led clinic care.",
  applicationName: "Curais",
  openGraph: { title: "Curais — Clear help now. Better care next.", description: "A calmer, connected path from a health moment to better follow-up care.", type: "website", siteName: "Curais" },
  twitter: { card: "summary_large_image", title: "Curais — Clear help now. Better care next.", description: "A calmer, connected path from a health moment to better follow-up care." },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#d9ecee", viewportFit: "cover" };

export default function RootLayout({ children }) {
  return <html lang="en" className="scroll-smooth"><body className={`${mulish.variable} ${quicksand.variable} ${mulish.className}`}><Providers>{children}</Providers></body></html>;
}
