"use client";
import { useState } from "react";
import Link from "next/link";

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "", email: "", empresa: "", url_objetivo: "",
    frecuencia: "", formato: "", descripcion: "", plan: "",
  });
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if ((await res.json()).ok) setEstado("ok");
      else setEstado("error");
    } catch { setEstado("error"); }
  };

  return (
    <main className="min-h-screen pt-14 pb-20">
      {/* Nav */}
      <div className="fixed top-0 inset-x-0 z-50 border-b border-gray-800/60 bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />Scraperfy
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/precios" className="hover:text-white">Precios</Link>
            <Link href="/docs" className="hover:text-white">Docs</Link>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-14">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Empieza a extraer datos</h1>
          <p className="text-gray-400">Cuéntanos tu caso de uso y te contactamos en menos de 24h.</p>
        </div>

        {estado === "ok" ? (
          <div className="rounded-2xl border border-emerald-700 bg-emerald-950/40 p-10 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-emerald-400 mb-2">¡Solicitud recibida!</h2>
            <p className="text-gray-400 text-sm">Te contactaremos en menos de 24 horas con los próximos pasos.</p>
            <Link href="/" className="mt-6 inline-block text-sm text-emerald-400 hover:underline">← Volver al inicio</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">Nombre *</label>
                <input required value={form.nombre} onChange={e => set("nombre", e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">Email *</label>
                <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Empresa</label>
              <input value={form.empresa} onChange={e => set("empresa", e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">URL objetivo (sitio a scrapear) *</label>
              <input required value={form.url_objetivo} onChange={e => set("url_objetivo", e.target.value)}
                placeholder="https://ejemplo.com/productos"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">Frecuencia *</label>
                <select required value={form.frecuencia} onChange={e => set("frecuencia", e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Seleccionar…</option>
                  <option>Una vez</option>
                  <option>Diaria</option>
                  <option>Semanal</option>
                  <option>En tiempo real</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">Formato preferido *</label>
                <select required value={form.formato} onChange={e => set("formato", e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Seleccionar…</option>
                  <option>JSON</option>
                  <option>CSV</option>
                  <option>Excel</option>
                  <option>Webhook</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Plan de interés</label>
              <select value={form.plan} onChange={e => set("plan", e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">No sé aún</option>
                <option>Free</option>
                <option>Pro (S/. 149/mes)</option>
                <option>Enterprise</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Descripción adicional</label>
              <textarea rows={4} value={form.descripcion} onChange={e => set("descripcion", e.target.value)}
                placeholder="¿Qué datos necesitas extraer? ¿Cuántas URLs? ¿Algún requisito especial?"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>
            {estado === "error" && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-800 rounded-xl px-4 py-3">
                Error al enviar. Intenta nuevamente o escríbenos directamente.
              </p>
            )}
            <button type="submit" disabled={estado === "enviando"}
              className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-60 transition-colors">
              {estado === "enviando" ? "Enviando…" : "Enviar solicitud"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
