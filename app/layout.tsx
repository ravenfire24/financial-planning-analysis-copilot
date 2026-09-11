import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FP&A Copilot",
  description: "A no-cost Vercel financial planning analysis copilot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
