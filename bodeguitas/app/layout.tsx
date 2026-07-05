import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bodeguitas — Storage Units in Santa Teresa",
  description:
    "Secure, affordable container storage in Santa Teresa, Costa Rica. Monthly rentals from $95/month.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
