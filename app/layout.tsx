import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scraperfy — Web Scraping como Servicio",
  description:
    "Extrae datos de cualquier sitio web de forma automática. Scraping escalable, programable y con soporte completo para sitios con JavaScript.",
  keywords: ["web scraping", "data extraction", "scraping API", "scraping service"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
