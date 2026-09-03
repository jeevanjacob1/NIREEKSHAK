import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustUs | MPLADS Intelligence",
  description:
    "AI-powered anomaly detection and intelligence platform for MPLADS projects.",
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