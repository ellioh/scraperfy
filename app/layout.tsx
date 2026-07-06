import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://scraperfy.com"),
  title: {
    default: "Scraperfy — Web Scraping como Servicio",
    template: "%s | Scraperfy",
  },
  description:
    "Extrae datos de cualquier sitio web de forma automática. Scraping escalable, programable y con soporte completo para sitios con JavaScript. Entrega en 48 horas.",
  keywords: [
    "web scraping", "data extraction", "scraping service", "scraping API",
    "extracción de datos", "web scraping Perú", "raspado web", "automatización datos",
    "scraping JavaScript", "scraping empresas", "dataset personalizado",
  ],
  authors: [{ name: "Scraperfy", url: "https://scraperfy.com" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://scraperfy.com",
    siteName: "Scraperfy",
    title: "Scraperfy — Web Scraping como Servicio",
    description:
      "Extrae datos de cualquier sitio web de forma automática. Scraping escalable, con soporte para JavaScript. Resultados en 48 horas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scraperfy — Web Scraping como Servicio",
    description: "Extrae datos de cualquier sitio web de forma automática.",
  },
  alternates: {
    canonical: "https://scraperfy.com",
    types: {
      "application/rss+xml": "https://scraperfy.com/feed.xml",
    },
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Scraperfy",
  url: "https://scraperfy.com",
  logo: "https://scraperfy.com/favicon.ico",
  description: "Web scraping como servicio para empresas en Perú y Latinoamérica.",
  sameAs: ["https://github.com/ellioh"],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Scraperfy",
  url: "https://scraperfy.com",
  description: "Extrae datos de cualquier sitio web de forma automática.",
  publisher: { "@type": "Organization", name: "Scraperfy" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
