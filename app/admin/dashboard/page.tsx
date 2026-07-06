import { getSolicitudes } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPosts } from "@/lib/blog";
import Link from "next/link";

export default async function DashboardPage() {
  if (!(await isAuthenticated())) redirect("/admin");

  const solicitudes = getSolicitudes();
  const noLeidas = solicitudes.filter(s => !s.leido).length;
  const hoy = new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const posts = getPosts(false);
  const publicados = posts.filter((p) => p.publicado).length;

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />Scraperfy Admin
            </div>
            <p className="text-xs text-gray-500">{hoy}</p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="text-xs text-gray-500 hover:text-white border border-gray-700 rounded-lg px-3 py-1.5 transition-colors">
              Cerrar sesión
            </button>
          </form>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{solicitudes.length}</div>
            <div className="text-sm text-gray-400">Solicitudes totales</div>
          </div>
          <div className={`rounded-2xl border p-5 ${noLeidas > 0 ? "border-emerald-700 bg-emerald-950/30" : "border-gray-800 bg-gray-900/50"}`}>
            <div className={`text-3xl font-bold mb-1 ${noLeidas > 0 ? "text-emerald-400" : "text-gray-500"}`}>{noLeidas}</div>
            <div className="text-sm text-gray-400">Sin leer</div>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{publicados}</div>
            <div className="text-sm text-gray-400">Artículos publicados</div>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
            <div className="text-3xl font-bold text-gray-500 mb-1">{posts.length}</div>
            <div className="text-sm text-gray-400">Artículos totales</div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <Link href="/admin/dashboard/solicitudes"
            className="rounded-xl border border-gray-800 bg-gray-900/40 hover:border-emerald-800/60 p-4 text-sm font-medium text-gray-300 hover:text-white transition-all">
            📬 Ver solicitudes
          </Link>
          <Link href="/admin/dashboard/blog"
            className="rounded-xl border border-gray-800 bg-gray-900/40 hover:border-emerald-800/60 p-4 text-sm font-medium text-gray-300 hover:text-white transition-all">
            ✍️ Gestionar blog
          </Link>
          <Link href="/admin/dashboard/productos"
            className="rounded-xl border border-gray-800 bg-gray-900/40 hover:border-emerald-800/60 p-4 text-sm font-medium text-gray-300 hover:text-white transition-all">
            🛍 Gestionar servicios
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-200">Últimas solicitudes</h2>
          <Link href="/admin/dashboard/solicitudes" className="text-xs text-emerald-400 hover:underline">Ver todas →</Link>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 overflow-hidden">
          {solicitudes.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">Sin solicitudes aún.</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {solicitudes.slice(0, 5).map(s => (
                <div key={s.id} className={`px-5 py-3.5 flex items-start justify-between gap-4 ${!s.leido ? "bg-emerald-950/20" : ""}`}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!s.leido && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                      <span className="font-medium text-sm truncate">{s.nombre}</span>
                      <span className="text-xs text-gray-500 shrink-0">{s.empresa}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate font-mono">{s.url_objetivo}</div>
                  </div>
                  <div className="text-xs text-gray-500 shrink-0">{new Date(s.fecha).toLocaleDateString("es-PE")}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
