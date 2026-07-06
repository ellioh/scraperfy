import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategorias, getPostsByCategoria } from "@/lib/blog";

interface Props {
  params: Promise<{ categoria: string }>;
}

export async function generateStaticParams() {
  return getCategorias().map((cat) => ({ categoria: cat.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const decoded = decodeURIComponent(categoria);
  const displayName = getCategorias().find((c) => c.toLowerCase() === decoded);
  if (!displayName) return { title: "Categoría no encontrada | Scraperfy" };

  return {
    title: `${displayName} — Blog | Scraperfy`,
    description: `Artículos sobre ${displayName}: web scraping, extracción de datos y automatización para empresas.`,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const decoded = decodeURIComponent(categoria);
  const allCats = getCategorias();
  const displayName = allCats.find((c) => c.toLowerCase() === decoded);
  if (!displayName) notFound();

  const posts = getPostsByCategoria(displayName);

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-800/60 bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Scraperfy
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
            <Link href="/blog" className="text-white font-medium">Blog</Link>
            <Link href="/precios" className="hover:text-white transition-colors">Precios</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
          <Link href="/contacto" className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white transition-colors">
            Empezar gratis
          </Link>
        </div>
      </nav>

      <section className="pt-28 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-gray-400 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-400">{displayName}</span>
          </nav>

          <h1 className="text-4xl font-extrabold text-white mb-2">{displayName}</h1>
          <p className="text-gray-500 mb-4">
            {posts.length} {posts.length === 1 ? "artículo" : "artículos"}
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            <Link href="/blog" className="px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-gray-400 hover:text-white text-sm transition-all">
              Todos
            </Link>
            {allCats.map((cat) => (
              <Link
                key={cat}
                href={`/blog/categoria/${encodeURIComponent(cat.toLowerCase())}`}
                className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                  cat === displayName
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-medium"
                    : "bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-600">No hay artículos en esta categoría aún.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-emerald-800/60 p-6 flex flex-col gap-4 transition-all hover:-translate-y-1"
                >
                  <h2 className="text-white font-bold text-lg leading-snug group-hover:text-emerald-300 transition-colors">
                    {post.titulo}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed flex-1">{post.resumen}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-800">
                    <time dateTime={post.fechaPublicacion}>
                      {new Date(post.fechaPublicacion).toLocaleDateString("es-PE", {
                        year: "numeric", month: "short", day: "numeric",
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

      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Scraperfy
          </Link>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
