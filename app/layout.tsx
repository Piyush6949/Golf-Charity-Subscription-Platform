import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GolfCharity — Play Golf. Win Prizes. Change Lives.",
  description:
    "A subscription-based golf platform combining performance tracking, monthly prize draws, and charitable giving. Enter your scores, compete in monthly draws, and make a difference.",
  keywords: [
    "golf",
    "charity",
    "subscription",
    "prize draw",
    "stableford",
    "charitable giving",
  ],
  openGraph: {
    title: "GolfCharity — Play Golf. Win Prizes. Change Lives.",
    description:
      "Enter your golf scores, win monthly prizes, and support the charities you care about.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
