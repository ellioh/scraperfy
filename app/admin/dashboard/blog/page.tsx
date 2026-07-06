"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Post {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  publicado: boolean;
  fechaPublicacion: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    const res = await fetch("/api/admin/blog");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadPosts(); }, []);

  async function togglePublicado(post: Post) {
    await fetch("/api/admin/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, publicado: !post.publicado }),
    });
    loadPosts();
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este artículo?")) return;
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadPosts();
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold text-xl">Blog</h1>
          <Link
            href="/admin/dashboard/blog/nuevo"
            className="ml-auto px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors"
          >
            + Nuevo artículo
          </Link>
        </div>

        {loading ? (
          <div className="text-gray-500 py-12 text-center">Cargando...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border border-gray-800 rounded-2xl">
            <p className="text-gray-500 mb-4">No hay artículos aún.</p>
            <Link href="/admin/dashboard/blog/nuevo" className="text-emerald-400 hover:underline text-sm">
              Crear el primero →
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Título</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Categoría</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium hidden lg:table-cell">Fecha</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Estado</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr
                    key={post.id}
                    className={`border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors ${
                      i === posts.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="text-white font-medium line-clamp-1">{post.titulo}</div>
                      <div className="text-gray-600 text-xs mt-0.5">/blog/{post.slug}</div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-gray-400">{post.categoria}</td>
                    <td className="py-3 px-4 hidden lg:table-cell text-gray-500">
                      {new Date(post.fechaPublicacion).toLocaleDateString("es-PE")}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        post.publicado
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-gray-700/50 text-gray-500"
                      }`}>
                        {post.publicado ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 justify-end">
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-white text-xs transition-colors"
                        >
                          Ver
                        </a>
                        <button
                          onClick={() => togglePublicado(post)}
                          className="text-gray-500 hover:text-emerald-400 text-xs transition-colors"
                        >
                          {post.publicado ? "Despublicar" : "Publicar"}
                        </button>
                        <Link
                          href={`/admin/dashboard/blog/${post.id}`}
                          className="text-gray-500 hover:text-white text-xs transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => eliminar(post.id)}
                          className="text-gray-500 hover:text-red-400 text-xs transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
