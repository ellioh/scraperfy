import Link from "next/link";
import ScraperfyNav from "@/components/ScraperfyNav";
import { getPosts } from "@/lib/blog";

const FEATURES = [
  { icon: "⚡", title: "Velocidad masiva", desc: "Scraping paralelo de miles de páginas por minuto con arquitectura distribuida." },
  { icon: "🤖", title: "JavaScript rendering", desc: "Soporte headless completo para SPAs, React, Vue y contenido dinámico con AJAX." },
  { icon: "⏱", title: "Programación cron", desc: "Define horarios precisos: cada hora, diario, semanal o en tiempo real con webhooks." },
  { icon: "🔄", title: "Rotación de proxies", desc: "Pool de miles de IPs residenciales y datacenter. Sin bloqueos, sin CAPTCHAs." },
  { icon: "📦", title: "Múltiples formatos", desc: "Exporta en JSON, CSV, Excel. Envía por webhook o almacena en S3 / Google Drive." },
  { icon: "🛡", title: "99.9% uptime", desc: "Reintentos automáticos, monitoreo 24/7 y alertas por email si algo falla." },
];

const PLANS = [
  {
    name: "Free",
    price: "S/. 0",
    period: "/mes",
    desc: "Para explorar",
    features: ["500 páginas/mes", "1 job activo", "Solo JSON", "Soporte community"],
    cta: "Empezar gratis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "S/. 149",
    period: "/mes",
    desc: "Para equipos y startups",
    features: ["50,000 páginas/mes", "10 jobs activos", "JSON, CSV, Excel", "Proxies básicos", "Webhooks", "Soporte por email"],
    cta: "Empezar Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Para grandes volúmenes",
    features: ["Páginas ilimitadas", "Jobs ilimitados", "Todos los formatos", "Proxies premium", "SLA garantizado", "Soporte dedicado"],
    cta: "Contactar ventas",
    highlight: false,
  },
];

export default function HomePage() {
  const recentPosts = getPosts().slice(0, 3);

  return (
    <>
      <ScraperfyNav />

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12)_0%,_transparent_60%)]" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-800 bg-emerald-950/50 text-emerald-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Nuevo: API v2 disponible con streaming
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Extrae datos de{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              cualquier web,
            </span>{" "}
            a escala
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Scraperfy convierte cualquier sitio web en tu fuente de datos. Programa, escala
            y exporta sin escribir una sola línea de código.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contacto"
              className="px-7 py-3 rounded-xl font-bold text-base bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-900/40 transition-all">
              Empezar gratis
            </Link>
            <Link href="/servicios"
              className="px-7 py-3 rounded-xl font-bold text-base border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all">
              Ver servicios →
            </Link>
          </div>

          {/* Terminal preview */}
          <div className="mt-14 mx-auto max-w-2xl rounded-2xl border border-gray-800 bg-gray-900/80 overflow-hidden text-left shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-800 bg-gray-900">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-2 text-xs text-gray-500 font-mono">scraperfy — resultado.json</span>
            </div>
            <pre className="p-5 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed">
{`$ scraperfy run --url "https://ejemplo.com/productos" \\
  --fields nombre:.product-title precio:.price

✓ Conectado · renderizando JavaScript...
✓ 847 productos encontrados · exportando...

[
  {
    "nombre": "Laptop HP Pavilion 15",
    "precio": "S/. 2,499.00",
    "url": "https://ejemplo.com/laptop-hp-pavilion"
  },
  {
    "nombre": "Monitor LG 27\\" 4K",
    "precio": "S/. 1,199.00",
    "url": "https://ejemplo.com/monitor-lg-27"
  }
  // ... 845 más
]

✓ Exportado en 4.2s · 847 registros · 128KB`}
            </pre>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-10 border-y border-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-6">Empresas que confían en Scraperfy</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-14 text-gray-600 font-semibold text-sm">
            {["DataMart Analytics", "PropSearch", "NewsAgg", "PriceBot", "LeadGen Pro"].map(n => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="caracteristicas" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Todo lo que necesitas para extraer datos</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Sin configurar servidores, sin gestionar proxies, sin escribir código de scraping.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 hover:border-emerald-800/50 transition-colors group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">¿Cómo funciona?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Define el objetivo", desc: "Ingresa la URL y configura los selectores CSS o XPath de los campos que quieres extraer." },
              { n: "02", title: "Programa o dispara", desc: "Ejecuta manualmente, define un cron job o intégralo a tu pipeline vía API REST." },
              { n: "03", title: "Recibe tus datos", desc: "Descarga JSON, CSV o Excel. O configura un webhook para recibir datos en tiempo real." },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold text-lg flex items-center justify-center mx-auto mb-4">{s.n}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API preview */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">API REST</div>
            <h2 className="text-3xl font-bold mb-4">Integra en minutos</h2>
            <p className="text-gray-400 mb-6">API REST con autenticación Bearer. Disponible en cualquier lenguaje. Documentación completa con ejemplos.</p>
            <Link href="/docs" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
              Ver documentación completa →
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 bg-gray-900/80">
              <span className="text-xs text-emerald-400 font-mono font-bold">POST</span>
              <span className="text-xs text-gray-400 font-mono">/v1/jobs</span>
            </div>
            <pre className="p-5 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://api.scraperfy.com/v1/jobs \\
  -H "Authorization: Bearer sk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://ejemplo.com/productos",
    "selector": ".product-card",
    "fields": {
      "nombre": "h2.title",
      "precio": "span.price",
      "imagen": "img@src"
    },
    "schedule": "0 8 * * *",
    "format": "json"
  }'

// Respuesta:
{
  "job_id": "job_8f3a2c1d",
  "status": "queued",
  "estimated_time": "~12s"
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Casos de uso populares</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "💰", title: "Inteligencia de precios", desc: "Monitorea precios de competidores en múltiples tiendas y marketplaces en tiempo real." },
              { icon: "🎯", title: "Generación de leads", desc: "Extrae contactos de directorios, LinkedIn y páginas de empresas para tu equipo de ventas." },
              { icon: "📰", title: "Monitoreo de contenido", desc: "Agrega noticias, reseñas y menciones de marca desde cientos de fuentes automáticamente." },
            ].map(c => (
              <div key={c.title} className="rounded-xl border border-gray-800 p-6">
                <div className="text-2xl mb-3">{c.icon}</div>
                <h3 className="font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-gray-400">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Planes simples y transparentes</h2>
          <p className="text-gray-400 text-center mb-12">Sin contratos. Cancela cuando quieras.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {PLANS.map(p => (
              <div key={p.name}
                className={`rounded-2xl border p-7 flex flex-col ${p.highlight ? "border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-900/20" : "border-gray-800 bg-gray-900/50"}`}>
                {p.highlight && <div className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-widest">Más popular</div>}
                <div className="mb-1 font-bold text-lg">{p.name}</div>
                <div className="text-xs text-gray-500 mb-4">{p.desc}</div>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold">{p.price}</span>
                  <span className="text-gray-500 text-sm">{p.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/contacto"
                  className={`py-2.5 rounded-xl text-sm font-bold text-center transition-colors ${p.highlight ? "bg-emerald-500 hover:bg-emerald-400 text-white" : "border border-gray-700 hover:border-gray-500 text-gray-300"}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Lo que dicen nuestros clientes</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { q: "Scraperfy nos ahorra 20 horas semanales de trabajo manual. Los datos llegan directos a nuestro dashboard.", name: "Carlos R.", role: "CTO, DataMart Analytics" },
              { q: "La API es increíblemente simple. En 30 minutos teníamos scraping de 50 portales inmobiliarios funcionando.", name: "Sofía M.", role: "Lead Dev, PropSearch" },
              { q: "La rotación de proxies automática es un game changer. Cero bloqueos en 6 meses de uso.", name: "Andrés V.", role: "Data Engineer, NewsAgg" },
            ].map(t => (
              <div key={t.name} className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
                <p className="text-sm text-gray-300 italic mb-4">&ldquo;{t.q}&rdquo;</p>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      {recentPosts.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Blog</div>
                <h2 className="text-2xl font-bold text-white">Últimos artículos</h2>
              </div>
              <Link href="/blog" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                Ver todos →
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-emerald-800/60 p-6 flex flex-col gap-3 transition-all hover:-translate-y-1"
                >
                  <span className="text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full w-fit">
                    {post.categoria}
                  </span>
                  <h3 className="text-white font-bold text-sm leading-snug group-hover:text-emerald-300 transition-colors">
                    {post.titulo}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed flex-1">{post.resumen.slice(0, 100)}...</p>
                  <span className="text-emerald-400 text-xs group-hover:translate-x-0.5 transition-transform">
                    Leer artículo →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">¿Listo para automatizar tus datos?</h2>
          <p className="text-gray-400 mb-8">Empieza gratis hoy. No necesitas tarjeta de crédito.</p>
          <Link href="/contacto"
            className="inline-block px-8 py-3.5 rounded-xl font-bold text-base bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg transition-all">
            Empezar ahora →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between gap-6">
          <div>
            <div className="font-bold text-lg flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Scraperfy
            </div>
            <p className="text-xs text-gray-500">Web scraping como servicio.<br />scraperfy.com</p>
          </div>
          <div className="flex gap-10 text-sm text-gray-500">
            <div className="space-y-2">
              <div className="font-semibold text-gray-300 text-xs uppercase tracking-wide mb-3">Producto</div>
              <Link href="/servicios" className="block hover:text-white transition-colors">Servicios</Link>
              <Link href="/precios" className="block hover:text-white transition-colors">Precios</Link>
              <Link href="/docs" className="block hover:text-white transition-colors">Documentación</Link>
              <Link href="/blog" className="block hover:text-white transition-colors">Blog</Link>
              <Link href="/contacto" className="block hover:text-white transition-colors">Contacto</Link>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-gray-800/50 text-xs text-gray-600 text-center">
          © {new Date().getFullYear()} Scraperfy. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
}
