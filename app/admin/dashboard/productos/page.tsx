"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  tipo: "unico" | "mensual" | "cotizar";
  etiqueta: string;
  caracteristicas: string[];
  cta: string;
  activo: boolean;
  orden: number;
}

const TIPO_LABEL: Record<string, string> = {
  unico: "Pago único",
  mensual: "/mes",
  cotizar: "Cotizar",
};

type FormState = {
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  tipo: "unico" | "mensual" | "cotizar";
  etiqueta: string;
  caracteristicas: string[];
  cta: string;
  activo: boolean;
};

const EMPTY_FORM: FormState = {
  nombre: "",
  descripcion: "",
  precio: 0,
  moneda: "S/.",
  tipo: "unico",
  etiqueta: "",
  caracteristicas: [],
  cta: "Contratar ahora",
  activo: true,
};

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [caracteristicasStr, setCaracteristicasStr] = useState("");

  async function load() {
    const res = await fetch("/api/admin/productos");
    if (res.ok) setProductos(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function iniciarNuevo() {
    setEditando(null);
    setForm({ ...EMPTY_FORM });
    setCaracteristicasStr("");
    setError("");
    setMostrarForm(true);
  }

  function iniciarEdicion(p: Producto) {
    setEditando(p);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      moneda: p.moneda,
      tipo: p.tipo,
      etiqueta: p.etiqueta,
      caracteristicas: p.caracteristicas,
      cta: p.cta,
      activo: p.activo,
    });
    setCaracteristicasStr(p.caracteristicas.join("\n"));
    setError("");
    setMostrarForm(true);
  }

  function set(key: string, value: string | boolean | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function guardar() {
    setGuardando(true);
    setError("");
    try {
      const body = {
        ...form,
        caracteristicas: caracteristicasStr.split("\n").map((c) => c.trim()).filter(Boolean),
        ...(editando ? { id: editando.id } : {}),
      };
      const res = await fetch("/api/admin/productos", {
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Error al guardar");
      setEditando(null);
      setForm({ ...EMPTY_FORM });
      setMostrarForm(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch("/api/admin/productos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold text-xl">Servicios / Productos</h1>
          <span className="text-xs text-gray-500 ml-1">— catálogo en /servicios</span>
          <button
            onClick={iniciarNuevo}
            className="ml-auto px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors"
          >
            + Nuevo servicio
          </button>
        </div>

        {/* Form */}
        {mostrarForm && (
          <div className="mb-8 border border-gray-800 rounded-2xl p-6 bg-gray-900/40">
            <h2 className="text-lg font-bold text-white mb-5">
              {editando ? "Editar servicio" : "Nuevo servicio"}
            </h2>

            {error && (
              <div className="mb-4 bg-red-950/30 border border-red-800/60 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
                <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Etiqueta (ej. "Más popular")</label>
                <input value={form.etiqueta} onChange={(e) => set("etiqueta", e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-600" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                <textarea value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} rows={2}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
                <select value={form.tipo} onChange={(e) => set("tipo", e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-600">
                  <option value="unico">Pago único</option>
                  <option value="mensual">Mensual</option>
                  <option value="cotizar">Cotizar</option>
                </select>
              </div>
              <div className="flex gap-3">
                <div className="w-20">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Moneda</label>
                  <input value={form.moneda} onChange={(e) => set("moneda", e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Precio</label>
                  <input type="number" value={form.precio} onChange={(e) => set("precio", Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-600" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Características (una por línea)</label>
                <textarea value={caracteristicasStr} onChange={(e) => setCaracteristicasStr(e.target.value)} rows={5}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono resize-y focus:outline-none focus:border-emerald-600"
                  placeholder={"Entrega en 24h\nFormatos: JSON, CSV\nSoporte por email"} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Texto del botón CTA</label>
                <input value={form.cta} onChange={(e) => set("cta", e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-600" />
              </div>
              <div className="flex items-end pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.activo} onChange={(e) => set("activo", e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500" />
                  <span className="text-sm text-gray-300">Visible en /servicios</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={guardar} disabled={guardando}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
                {guardando ? "Guardando..." : "Guardar"}
              </button>
              <button onClick={() => { setEditando(null); setMostrarForm(false); }}
                className="px-5 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-gray-500 py-12 text-center">Cargando...</div>
        ) : (
          <div className="space-y-3">
            {productos.map((prod) => (
              <div key={prod.id} className="border border-gray-800 rounded-xl p-5 bg-gray-900/30 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm">{prod.nombre}</span>
                    {prod.etiqueta && (
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {prod.etiqueta}
                      </span>
                    )}
                    {!prod.activo && (
                      <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">Oculto</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-1">{prod.descripcion}</p>
                </div>
                <div className="text-right shrink-0">
                  {prod.tipo === "cotizar" ? (
                    <span className="text-gray-400 text-sm font-bold">Cotizar</span>
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {prod.moneda} {prod.precio.toLocaleString("es-PE")}
                      <span className="text-gray-500 font-normal ml-1">{TIPO_LABEL[prod.tipo]}</span>
                    </span>
                  )}
                </div>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => iniciarEdicion(prod)}
                    className="text-gray-500 hover:text-white text-xs transition-colors">Editar</button>
                  <button onClick={() => eliminar(prod.id)}
                    className="text-gray-500 hover:text-red-400 text-xs transition-colors">Eliminar</button>
                </div>
              </div>
            ))}
            {productos.length === 0 && !mostrarForm && (
              <div className="text-center py-16 border border-gray-800 rounded-2xl text-gray-600">
                Sin servicios. Crea el primero.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
