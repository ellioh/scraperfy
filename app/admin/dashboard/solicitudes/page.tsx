"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Solicitud {
  id: string; nombre: string; email: string; empresa: string;
  url_objetivo: string; frecuencia: string; formato: string;
  descripcion: string; plan: string; fecha: string; leido: boolean;
}

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/solicitudes").then(r => r.json()).then(d => setSolicitudes(d.data ?? []));
  }, []);

  const marcarLeido = async (id: string) => {
    await fetch("/api/admin/solicitudes", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, leido: true } : s));
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold text-xl">Solicitudes</h1>
          <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">
            {solicitudes.filter(s => !s.leido).length} sin leer
          </span>
        </div>

        {solicitudes.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 p-12 text-center text-gray-500">Sin solicitudes aún.</div>
        ) : (
          <div className="space-y-3">
            {solicitudes.map(s => (
              <div key={s.id} className={`rounded-2xl border ${!s.leido ? "border-emerald-700 bg-emerald-950/20" : "border-gray-800 bg-gray-900/40"}`}>
                <button onClick={() => setOpen(open === s.id ? null : s.id)}
                  className="w-full px-5 py-4 flex items-start justify-between gap-4 text-left">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!s.leido && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                      <span className="font-semibold text-sm">{s.nombre}</span>
                      {s.empresa && <span className="text-xs text-gray-500">· {s.empresa}</span>}
                      {s.plan && <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400">{s.plan}</span>}
                    </div>
                    <div className="text-xs text-gray-400 font-mono truncate">{s.url_objetivo}</div>
                  </div>
                  <div className="text-xs text-gray-500 shrink-0">{new Date(s.fecha).toLocaleDateString("es-PE")}</div>
                </button>
                {open === s.id && (
                  <div className="px-5 pb-5 border-t border-gray-800/60 pt-4 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500 text-xs">Email:</span><div className="text-white">{s.email}</div></div>
                      <div><span className="text-gray-500 text-xs">Frecuencia:</span><div className="text-white">{s.frecuencia}</div></div>
                      <div><span className="text-gray-500 text-xs">Formato:</span><div className="text-white">{s.formato}</div></div>
                      <div><span className="text-gray-500 text-xs">Plan:</span><div className="text-white">{s.plan || "No especificado"}</div></div>
                    </div>
                    {s.descripcion && (
                      <div>
                        <span className="text-gray-500 text-xs">Descripción:</span>
                        <p className="text-sm text-gray-300 mt-1 bg-gray-800/50 rounded-lg p-3">{s.descripcion}</p>
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <a href={`mailto:${s.email}`}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
                        Responder por email
                      </a>
                      {!s.leido && (
                        <button onClick={() => marcarLeido(s.id)}
                          className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                          Marcar como leído
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
