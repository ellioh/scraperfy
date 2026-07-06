"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarBlogPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    slug: "",
    resumen: "",
    contenido: "",
    categoria: "",
    fechaPublicacion: "",
    tags: "",
    metaDescripcion: "",
    publicado: false,
  });

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then((post) => {
        setForm({
          titulo: post.titulo,
          slug: post.slug,
          resumen: post.resumen,
          contenido: post.contenido,
          categoria: post.categoria,
          fechaPublicacion: post.fechaPublicacion,
          tags: post.tags.join(", "),
          metaDescripcion: post.metaDescripcion || "",
          publicado: post.publicado,
        });
        setCargando(false);
      })
      .catch(() => {
        setError("No se pudo cargar el artículo.");
        setCargando(false);
      });
  }, [id]);

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Error al guardar");
      router.push("/admin/dashboard/blog");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/dashboard/blog" className="text-gray-500 hover:text-gray-300 text-sm">← Blog</Link>
          <h1 className="font-bold text-xl">Editar artículo</h1>
        </div>

        {cargando ? (
          <div className="text-gray-500 py-12 text-center">Cargando...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-950/30 border border-red-800/60 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Título</label>
              <input
                value={form.titulo}
                onChange={(e) => set("titulo", e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Slug (URL)</label>
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-600"
              />
              <p className="text-xs text-gray-600 mt-1">scraperfy.com/blog/{form.slug}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Resumen</label>
              <textarea
                value={form.resumen}
                onChange={(e) => set("resumen", e.target.value)}
                required
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm resize-none focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Contenido (Markdown)</label>
              <textarea
                value={form.contenido}
                onChange={(e) => set("contenido", e.target.value)}
                required
                rows={20}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm font-mono resize-y focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Categoría</label>
                <input
                  value={form.categoria}
                  onChange={(e) => set("categoria", e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Fecha de publicación</label>
                <input
                  type="date"
                  value={form.fechaPublicacion}
                  onChange={(e) => set("fechaPublicacion", e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Tags (separados por coma)</label>
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Meta descripción <span className="text-gray-600">({form.metaDescripcion.length}/160)</span>
              </label>
              <textarea
                value={form.metaDescripcion}
                onChange={(e) => set("metaDescripcion", e.target.value)}
                maxLength={160}
                rows={2}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm resize-none focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="publicado"
                checked={form.publicado}
                onChange={(e) => set("publicado", e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <label htmlFor="publicado" className="text-sm text-gray-300">Publicado</label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
              <Link
                href="/admin/dashboard/blog"
                className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
