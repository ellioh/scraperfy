import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "S/. 0",
    period: "/mes",
    desc: "Para explorar y probar",
    features: [
      { label: "Páginas/mes", val: "500" },
      { label: "Jobs activos", val: "1" },
      { label: "Formato de salida", val: "JSON" },
      { label: "Frecuencia mínima", val: "Manual / Diario" },
      { label: "Proxies", val: "No" },
      { label: "Webhooks", val: "No" },
      { label: "Soporte", val: "Community" },
      { label: "SLA", val: "No" },
    ],
    cta: "Empezar gratis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "S/. 149",
    period: "/mes",
    desc: "Para equipos y startups",
    features: [
      { label: "Páginas/mes", val: "50,000" },
      { label: "Jobs activos", val: "10" },
      { label: "Formato de salida", val: "JSON, CSV, Excel" },
      { label: "Frecuencia mínima", val: "Cada hora" },
      { label: "Proxies", val: "Básico (datacenter)" },
      { label: "Webhooks", val: "Sí" },
      { label: "Soporte", val: "Email (48h)" },
      { label: "SLA", val: "99.5%" },
    ],
    cta: "Empezar Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Para grandes volúmenes",
    features: [
      { label: "Páginas/mes", val: "Ilimitado" },
      { label: "Jobs activos", val: "Ilimitado" },
      { label: "Formato de salida", val: "Todos + custom" },
      { label: "Frecuencia mínima", val: "Tiempo real" },
      { label: "Proxies", val: "Premium residencial" },
      { label: "Webhooks", val: "Sí + retries" },
      { label: "Soporte", val: "Dedicado (4h)" },
      { label: "SLA", val: "99.9% garantizado" },
    ],
    cta: "Contactar ventas",
    highlight: false,
  },
];

export default function PreciosPage() {
  return (
    <main className="min-h-screen pt-20 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        {/* Nav simple */}
        <div className="fixed top-0 inset-x-0 z-50 border-b border-gray-800/60 bg-gray-950/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />Scraperfy
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <Link href="/" className="hover:text-white">Inicio</Link>
              <Link href="/docs" className="hover:text-white">Docs</Link>
              <Link href="/contacto" className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-colors">
                Empezar gratis
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold mb-4">Precios simples y transparentes</h1>
          <p className="text-gray-400 max-w-lg mx-auto">Sin contratos anuales. Sin costos ocultos. Cancela cuando quieras.</p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {PLANS.map(p => (
            <div key={p.name}
              className={`rounded-2xl border p-7 flex flex-col ${p.highlight ? "border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-900/20 relative" : "border-gray-800 bg-gray-900/50"}`}>
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                  Más popular
                </div>
              )}
              <div className="font-bold text-xl mb-1">{p.name}</div>
              <div className="text-xs text-gray-500 mb-5">{p.desc}</div>
              <div className="mb-7">
                <span className="text-4xl font-extrabold">{p.price}</span>
                <span className="text-gray-500 text-sm">{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map(f => (
                  <li key={f.label} className="flex justify-between text-sm border-b border-gray-800/60 pb-2">
                    <span className="text-gray-400">{f.label}</span>
                    <span className="text-white font-medium">{f.val}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contacto"
                className={`py-3 rounded-xl font-bold text-sm text-center transition-colors ${p.highlight ? "bg-emerald-500 hover:bg-emerald-400 text-white" : "border border-gray-700 hover:border-emerald-600 text-gray-300 hover:text-white"}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {[
              { q: "¿Qué cuenta como una página?", a: "Cada URL única que el sistema scrapeé cuenta como una página, independientemente del número de campos extraídos." },
              { q: "¿Puedo cambiar de plan?", a: "Sí. Puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplican en el siguiente ciclo de facturación." },
              { q: "¿Funciona con sitios que requieren login?", a: "El plan Pro y Enterprise incluyen soporte para autenticación básica y por cookies. Contacta para casos más complejos." },
              { q: "¿Qué pasa si supero mi límite de páginas?", a: "El job se pausa y recibes una notificación por email. Puedes upgradear o esperar al siguiente mes." },
            ].map(faq => (
              <div key={faq.q} className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                <div className="font-semibold text-white mb-2">{faq.q}</div>
                <div className="text-sm text-gray-400">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
