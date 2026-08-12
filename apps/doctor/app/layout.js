import { Mulish, Quicksand } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@curais/ui";

const mulish = Mulish({ subsets: ["latin"], variable: "--font-mulish" });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });

export const metadata = { title: "Curais Doctor", description: "The consent-led Curais clinical workspace." };

export default function RootLayout({ children }) {
  return <html lang="en"><body className={`${mulish.variable} ${quicksand.variable} ${mulish.className}`}><ToastProvider>{children}</ToastProvider></body></html>;
}
