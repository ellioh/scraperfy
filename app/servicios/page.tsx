import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import ProductosGrid from "@/components/ProductosGrid";
import { getProductos } from "@/lib/productos";

// generateMetadata y la pagina piden lo mismo: cache() lo consulta una sola vez por peticion.
const getProductosActivos = cache(() => getProductos());

export async function generateMetadata(): Promise<Metadata> {
  const productos = await getProductosActivos();
  // El "desde" sale del servicio de menor precio en la BD, no de un texto fijo.
  const conPrecio = productos.filter((p) => p.tipo !== "cotizar" && p.precio > 0);
  const minimo = conPrecio.sort((a, b) => a.precio - b.precio)[0];
  const desde = minimo ? ` Desde ${minimo.moneda} ${minimo.precio.toLocaleString("es-PE")}.` : "";

  return {
    title: "Servicios de Scraping | Scraperfy — Extracción de Datos",
    description:
      "Servicios de web scraping para empresas: extracción única, monitoreo mensual, datasets a medida y soluciones enterprise. Precios claros, entrega rápida.",
    openGraph: {
      title: "Servicios de Web Scraping — Scraperfy",
      description: `Extracción de datos web para empresas.${desde} Soluciones a medida y enterprise con SLA garantizado.`,
      type: "website",
      url: "https://scraperfy.com/servicios",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ServiciosPage() {
  const productos = await getProductosActivos();

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-800/60 bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Scraperfy
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="/#caracteristicas" className="hover:text-white transition-colors">Características</Link>
            <Link href="/servicios" className="text-white font-medium">Servicios</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/precios" className="hover:text-white transition-colors">Precios</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
          <Link href="/contacto" className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white transition-colors">
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-800 bg-emerald-950/50 text-emerald-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Entrega en 48-72 horas
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Datos de la web,{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              a tu medida
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Elige el servicio que mejor se adapta a tu necesidad. Desde una extracción puntual hasta monitoreo continuo para tu empresa.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <ProductosGrid productos={productos} />

          {/* Guarantee */}
          <div className="mt-14 rounded-2xl border border-gray-800 bg-gray-900/40 p-8 grid sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: "⚡", title: "Entrega en 48-72h", desc: "Para extracciones únicas. Monitoreo activo desde el primer día." },
              { icon: "🔄", title: "Revisiones incluidas", desc: "Si el resultado no es exactamente lo que esperabas, lo ajustamos sin costo adicional." },
              { icon: "🔒", title: "Datos privados", desc: "Los datos que extraemos son exclusivamente tuyos. No los compartimos con terceros." },
            ].map((g) => (
              <div key={g.title}>
                <div className="text-2xl mb-3">{g.icon}</div>
                <h3 className="font-bold text-white mb-1.5">{g.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upwork / Workana profiles section */}
      <section className="py-16 px-4 bg-gray-900/30 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">También en plataformas freelance</p>
          <h2 className="text-2xl font-bold text-white mb-3">Contrátame directamente por Upwork o Workana</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            ¿Prefieres trabajar por una plataforma de confianza? Encuentra mi perfil con historial de proyectos, calificaciones y portafolio verificado.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-900/30 border border-green-700/40 text-green-400 text-sm font-semibold hover:bg-green-900/50 transition-all"
            >
              ↗ Ver perfil en Upwork
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-900/30 border border-blue-700/40 text-blue-400 text-sm font-semibold hover:bg-blue-900/50 transition-all"
            >
              ↗ Ver perfil en Workana
            </a>
            <a
              href="https://github.com/ellioh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 text-sm font-semibold hover:bg-gray-700 transition-all"
            >
              GitHub
            </a>
          </div>
          <p className="text-gray-600 text-xs mt-6">Actualiza las URLs de los perfiles en <code className="text-gray-500">app/servicios/page.tsx</code></p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿No sabes cuál elegir?</h2>
          <p className="text-gray-400 mb-8">
            Cuéntanos qué datos necesitas y te recomendamos el servicio correcto para tu caso. La consulta inicial es gratuita.
          </p>
          <Link
            href="/contacto"
            className="inline-block px-8 py-3.5 rounded-xl font-bold text-base bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg transition-all"
          >
            Consultar gratis →
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between gap-6">
          <div>
            <div className="font-bold text-lg flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Scraperfy
            </div>
            <p className="text-xs text-gray-500">Web scraping como servicio.</p>
          </div>
          <div className="flex gap-10 text-sm text-gray-500">
            <div className="space-y-2">
              <div className="font-semibold text-gray-300 text-xs uppercase tracking-wide mb-3">Producto</div>
              <Link href="/servicios" className="block hover:text-white transition-colors">Servicios</Link>
              <Link href="/precios" className="block hover:text-white transition-colors">Precios</Link>
              <Link href="/blog" className="block hover:text-white transition-colors">Blog</Link>
              <Link href="/contacto" className="block hover:text-white transition-colors">Contacto</Link>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-gray-800/50 text-xs text-gray-600 text-center">
          © {new Date().getFullYear()} Scraperfy. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
