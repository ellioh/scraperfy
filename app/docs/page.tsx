import Link from "next/link";

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden my-4">
      <div className="px-4 py-2 border-b border-gray-800 text-xs font-mono text-gray-500 bg-gray-900/80">{lang}</div>
      <pre className="p-5 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed whitespace-pre">{code}</pre>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-14 scroll-mt-20">
      <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-800">{title}</h2>
      {children}
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen pt-14">
      {/* Nav */}
      <div className="fixed top-0 inset-x-0 z-50 border-b border-gray-800/60 bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />Scraperfy
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/precios" className="hover:text-white">Precios</Link>
            <Link href="/contacto" className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-colors">
              Empezar gratis
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-10 pb-24 flex gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-20">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Documentación</p>
            <nav className="space-y-1 text-sm">
              {[
                ["autenticacion", "Autenticación"],
                ["crear-job", "Crear un Job"],
                ["listar-jobs", "Listar Jobs"],
                ["estado-job", "Estado de Job"],
                ["resultados", "Resultados"],
                ["webhooks", "Webhooks"],
                ["errores", "Errores"],
              ].map(([href, label]) => (
                <a key={href} href={`#${href}`} className="block py-1 text-gray-400 hover:text-emerald-400 transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="mb-10">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">API Reference v2</div>
            <h1 className="text-3xl font-bold mb-3">Documentación de la API</h1>
            <p className="text-gray-400">Base URL: <code className="text-emerald-400 font-mono text-sm">https://api.scraperfy.com/v1</code></p>
          </div>

          <Section id="autenticacion" title="Autenticación">
            <p className="text-gray-400 text-sm mb-3">Todas las peticiones requieren un API key en el header <code className="text-emerald-400 font-mono">Authorization</code>.</p>
            <CodeBlock lang="HTTP Header" code={`Authorization: Bearer sk_live_TuApiKeyAqui`} />
            <p className="text-gray-400 text-sm">Obtén tu API key desde el panel de control. Las keys de producción empiezan con <code className="font-mono text-gray-300">sk_live_</code> y las de prueba con <code className="font-mono text-gray-300">sk_test_</code>.</p>
          </Section>

          <Section id="crear-job" title="POST /jobs — Crear un scraping job">
            <p className="text-gray-400 text-sm mb-3">Crea y encola un nuevo job de scraping.</p>
            <CodeBlock lang="cURL" code={`curl -X POST https://api.scraperfy.com/v1/jobs \\
  -H "Authorization: Bearer sk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://ejemplo.com/productos",
    "selector": ".product-card",
    "fields": {
      "nombre": "h2.title",
      "precio": "span.price",
      "imagen": "img@src",
      "url":    "a@href"
    },
    "schedule": "0 8 * * *",
    "format": "json",
    "webhook": "https://mi-app.com/webhook/scraperfy"
  }'`} />
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-300 mb-2">Parámetros del body:</p>
              <div className="rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-900/80">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-gray-400 font-medium">Campo</th>
                      <th className="text-left px-4 py-2.5 text-gray-400 font-medium">Tipo</th>
                      <th className="text-left px-4 py-2.5 text-gray-400 font-medium">Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {[
                      ["url", "string *", "URL objetivo a scrapear"],
                      ["selector", "string *", "Selector CSS del contenedor de cada ítem"],
                      ["fields", "object *", "Mapa de campo → selector CSS (agrega @attr para atributos)"],
                      ["schedule", "string", "Expresión cron (ej: '0 8 * * *'). Omitir para ejecución única"],
                      ["format", "string", "json | csv | excel (default: json)"],
                      ["webhook", "string", "URL para notificación cuando el job termine"],
                    ].map(([f, t, d]) => (
                      <tr key={f} className="hover:bg-gray-900/40">
                        <td className="px-4 py-2.5 font-mono text-emerald-400 text-xs">{f}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{t}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-400">{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <CodeBlock lang="Respuesta 200 OK" code={`{
  "job_id": "job_8f3a2c1d",
  "status": "queued",
  "url": "https://ejemplo.com/productos",
  "format": "json",
  "estimated_time": "~12s",
  "created_at": "2025-07-05T10:00:00Z"
}`} />
          </Section>

          <Section id="listar-jobs" title="GET /jobs — Listar jobs">
            <p className="text-gray-400 text-sm mb-3">Devuelve todos los jobs del usuario autenticado.</p>
            <CodeBlock lang="cURL" code={`curl https://api.scraperfy.com/v1/jobs \\
  -H "Authorization: Bearer sk_live_xxx"`} />
            <CodeBlock lang="Respuesta 200 OK" code={`{
  "jobs": [
    {
      "job_id": "job_8f3a2c1d",
      "url": "https://ejemplo.com/productos",
      "status": "completed",
      "records": 847,
      "schedule": "0 8 * * *",
      "last_run": "2025-07-05T08:00:12Z",
      "next_run": "2025-07-06T08:00:00Z"
    }
  ],
  "total": 1
}`} />
          </Section>

          <Section id="estado-job" title="GET /jobs/{id} — Estado de un job">
            <CodeBlock lang="cURL" code={`curl https://api.scraperfy.com/v1/jobs/job_8f3a2c1d \\
  -H "Authorization: Bearer sk_live_xxx"`} />
            <CodeBlock lang="Respuesta 200 OK" code={`{
  "job_id": "job_8f3a2c1d",
  "status": "completed",
  "url": "https://ejemplo.com/productos",
  "records": 847,
  "duration_ms": 4200,
  "format": "json",
  "completed_at": "2025-07-05T08:00:16Z"
}`} />
          </Section>

          <Section id="resultados" title="GET /jobs/{id}/results — Descargar resultados">
            <p className="text-gray-400 text-sm mb-3">Descarga los datos extraídos en el formato configurado.</p>
            <CodeBlock lang="cURL" code={`curl https://api.scraperfy.com/v1/jobs/job_8f3a2c1d/results \\
  -H "Authorization: Bearer sk_live_xxx" \\
  -o resultados.json`} />
            <CodeBlock lang="Respuesta (JSON)" code={`[
  {
    "nombre": "Laptop HP Pavilion 15",
    "precio": "S/. 2,499.00",
    "imagen": "https://ejemplo.com/img/hp-pavilion.jpg",
    "url": "https://ejemplo.com/laptop-hp"
  },
  {
    "nombre": "Monitor LG 27\\" 4K",
    "precio": "S/. 1,199.00",
    "imagen": "https://ejemplo.com/img/lg-27.jpg",
    "url": "https://ejemplo.com/monitor-lg"
  }
]`} />
          </Section>

          <Section id="webhooks" title="Webhooks">
            <p className="text-gray-400 text-sm mb-3">Cuando un job termina, Scraperfy envía un POST a tu webhook URL con el siguiente payload:</p>
            <CodeBlock lang="Webhook payload (POST)" code={`{
  "event": "job.completed",
  "job_id": "job_8f3a2c1d",
  "status": "completed",
  "records": 847,
  "download_url": "https://api.scraperfy.com/v1/jobs/job_8f3a2c1d/results",
  "completed_at": "2025-07-05T08:00:16Z"
}`} />
            <p className="text-xs text-gray-500 mt-2">Los webhooks se reintentan hasta 3 veces con backoff exponencial si tu servidor no responde con 2xx.</p>
          </Section>

          <Section id="errores" title="Errores">
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-900/80">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-gray-400 font-medium">Código</th>
                    <th className="text-left px-4 py-2.5 text-gray-400 font-medium">Significado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-xs">
                  {[
                    ["400", "Bad Request — parámetros inválidos o faltantes"],
                    ["401", "Unauthorized — API key inválida o ausente"],
                    ["403", "Forbidden — plan no permite esta operación"],
                    ["404", "Not Found — job no encontrado"],
                    ["429", "Too Many Requests — límite de páginas alcanzado"],
                    ["500", "Internal Server Error — error en el scraping"],
                  ].map(([code, msg]) => (
                    <tr key={code} className="hover:bg-gray-900/40">
                      <td className="px-4 py-2.5 font-mono text-red-400">{code}</td>
                      <td className="px-4 py-2.5 text-gray-400">{msg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
