import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Santa Bodega — Bodegas de almacenamiento en Santa Teresa",
  description:
    "Alquila tu contenedor de almacenamiento en Santa Teresa, Costa Rica. Reserva en línea, paga con SINPE Móvil o tarjeta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${archivo.variable} ${inter.variable} font-body`}>{children}</body>
    </html>
  );
}
