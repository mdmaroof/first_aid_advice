import { Mulish, Quicksand } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const fontTwo = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });
const fontOne = Mulish({ subsets: ["latin"], variable: "--font-mulish" });

export const metadata = {
  title: "SnapAid",
  description:
    "Fast first-aid guidance from symptoms — not a substitute for emergency care.",
};

export const viewport = {
  themeColor: "#0D7377",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${fontOne.variable} ${fontTwo.variable} ${fontOne.className}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
