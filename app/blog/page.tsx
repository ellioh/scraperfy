import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, getCategorias } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Scraperfy | Web Scraping como Servicio",
  description:
    "Artículos sobre web scraping, extracción de datos, automatización y casos de uso para empresas en Perú y Latinoamérica.",
  openGraph: {
    title: "Blog de Scraperfy — Web Scraping y Extracción de Datos",
    description: "Guías, tutoriales y casos de uso sobre web scraping para empresas.",
    type: "website",
    url: "https://scraperfy.com/blog",
  },
};

export default function BlogPage() {
  const posts = getPosts();
  const categorias = getCategorias();

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-800/60 bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Scraperfy
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="/#caracteristicas" className="hover:text-white transition-colors">Características</Link>
            <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
            <Link href="/blog" className="text-white font-medium">Blog</Link>
            <Link href="/precios" className="hover:text-white transition-colors">Precios</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
          <Link href="/contacto" className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white transition-colors">
            Empezar gratis
          </Link>
        </div>
      </nav>

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">← Inicio</Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 mb-4">Blog</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Guías, tutoriales y casos de uso sobre web scraping y extracción de datos para empresas.
          </p>

          {categorias.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              <Link
                href="/blog"
                className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-medium"
              >
                Todos
              </Link>
              {categorias.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/categoria/${encodeURIComponent(cat.toLowerCase())}`}
                  className="px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 text-sm transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <p className="text-xl">Pronto habrá artículos aquí.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-emerald-800/60 p-6 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10"
                >
                  <span className="text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full w-fit">
                    {post.categoria}
                  </span>
                  <h2 className="text-white font-bold text-lg leading-snug group-hover:text-emerald-300 transition-colors">
                    {post.titulo}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed flex-1">{post.resumen}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-800">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-gray-600 bg-gray-800/70 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <time dateTime={post.fechaPublicacion}>
                      {new Date(post.fechaPublicacion).toLocaleDateString("es-PE", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </time>
                    <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">Leer →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 border-t border-gray-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">¿Necesitas datos específicos?</h2>
          <p className="text-gray-400 mb-6">Cuéntanos qué datos necesitas y te proponemos la solución correcta.</p>
          <Link
            href="/contacto"
            className="inline-block px-8 py-3.5 rounded-xl font-bold text-base bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg transition-all"
          >
            Hablar con un experto
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Scraperfy
          </Link>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
          <p className="text-gray-700 text-xs">© {new Date().getFullYear()} Scraperfy</p>
        </div>
      </footer>
    </div>
  );
}
