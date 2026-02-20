import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "LEPS - Ensayo estacionario de trazado curva I-V y determinación de punto máximo de potencia (MPP)",
  description:
    "Ensayo estacionario de trazado curva I-V y determinación de punto máximo de potencia (MPP) — Laboratorio de Ensayos para Paneles Solares (LEPS)",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
