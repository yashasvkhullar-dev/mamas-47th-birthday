import type { Metadata } from "next";
import { Quicksand, Caveat } from "next/font/google";
import "./globals.css";
import CornerPanda from "@/components/ui/CornerPanda";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy 47th Birthday, Mama! 🎂",
  description:
    "A special birthday experience crafted with love for the most wonderful mama in the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${caveat.variable}`}>
      <body className="font-quicksand antialiased">
        {children}
        <CornerPanda />
      </body>
    </html>
  );
}
