import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Artículo no encontrado | Scraperfy" };

  return {
    title: `${post.titulo} | Scraperfy Blog`,
    description: post.metaDescripcion,
    keywords: post.tags,
    authors: [{ name: "Equipo Scraperfy", url: "https://scraperfy.com" }],
    openGraph: {
      title: post.titulo,
      description: post.metaDescripcion,
      type: "article",
      url: `https://scraperfy.com/blog/${post.slug}`,
      publishedTime: post.fechaPublicacion,
      modifiedTime: post.fechaActualizacion,
      section: post.categoria,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.titulo,
      description: post.metaDescripcion,
    },
    alternates: {
      canonical: `https://scraperfy.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const relatedPosts = getPosts()
    .filter((p) => p.slug !== slug && p.categoria === post.categoria)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.metaDescripcion,
    keywords: post.tags.join(", "),
    datePublished: post.fechaPublicacion,
    dateModified: post.fechaActualizacion,
    author: {
      "@type": "Organization",
      name: "Scraperfy",
      url: "https://scraperfy.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Scraperfy",
      url: "https://scraperfy.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://scraperfy.com/blog/${post.slug}`,
    },
  };

  const contentHtml = renderMarkdown(post.contenido);

  return (
    <div className="min-h-screen bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-800/60 bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Scraperfy
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
            <Link href="/blog" className="text-white font-medium">Blog</Link>
            <Link href="/precios" className="hover:text-white transition-colors">Precios</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          </div>
          <Link href="/contacto" className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white transition-colors">
            Empezar gratis
          </Link>
        </div>
      </nav>

      <article className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-gray-400 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
            <span>/</span>
            <Link
              href={`/blog/categoria/${encodeURIComponent(post.categoria.toLowerCase())}`}
              className="hover:text-gray-400 transition-colors"
            >
              {post.categoria}
            </Link>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <Link
                href={`/blog/categoria/${encodeURIComponent(post.categoria.toLowerCase())}`}
                className="text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full hover:bg-emerald-500/20 transition-colors"
              >
                {post.categoria}
              </Link>
              <time dateTime={post.fechaPublicacion} className="text-gray-600 text-sm">
                {new Date(post.fechaPublicacion).toLocaleDateString("es-PE", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </time>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
              {post.titulo}
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">{post.resumen}</p>
          </header>

          <div className="flex items-center gap-3 py-5 border-y border-gray-800/60 mb-10">
            <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
              SF
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Equipo Scraperfy</p>
              <p className="text-gray-500 text-xs">Especialistas en Web Scraping y Extracción de Datos</p>
            </div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-800/60">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-gray-600 bg-gray-800/70 border border-gray-700/50 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-8 text-center">
            <div className="flex items-center justify-center gap-2 font-bold text-lg mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> ¿Necesitas estos datos para tu empresa?
            </div>
            <p className="text-gray-400 text-sm mb-5 max-w-md mx-auto">
              Nuestro equipo puede configurar el scraping exacto que necesitas y entregarte los datos en 48 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contacto"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
              >
                Solicitar datos ahora
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 rounded-xl font-bold text-sm border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors"
              >
                ← Más artículos
              </Link>
            </div>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="pb-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-bold text-white mb-6">Artículos relacionados</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-gray-800 hover:border-emerald-800/50 bg-gray-900/50 p-5 transition-all hover:-translate-y-0.5"
                >
                  <span className="text-xs text-emerald-400 mb-2 block">{p.categoria}</span>
                  <h3 className="text-white text-sm font-semibold leading-snug group-hover:text-emerald-300 transition-colors">
                    {p.titulo}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Scraperfy
          </Link>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
