import { Mulish, Quicksand } from "next/font/google";
import "./globals.css";

const fontTwo = Quicksand({ subsets: ["latin"], variable: '--font-quicksand', });
const fontOne = Mulish({ subsets: ["latin"], variable: '--font-mulish' });


export const metadata = {
  title: "SnapAid",
  description: "Generate first aid help using chatgpt",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fontOne.variable} ${fontTwo.variable} ${fontOne.className}`}>{children}</body>
    </html>
  );
}
