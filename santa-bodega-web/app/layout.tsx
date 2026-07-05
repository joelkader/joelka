import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Santa Bodega — Bodegas de almacenamiento en Santa Teresa",
  description:
    "Alquila tu contenedor de almacenamiento en Santa Teresa, Costa Rica. Reserva en línea, paga con SINPE Móvil o tarjeta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${fredoka.variable} ${inter.variable} font-body`}>{children}</body>
    </html>
  );
}
