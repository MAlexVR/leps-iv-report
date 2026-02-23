import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const roboto = localFont({
  src: [
    {
      path: "../../public/fonts/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roboto",
});

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
      <body className={`${roboto.variable} font-sans`}>{children}</body>
    </html>
  );
}
