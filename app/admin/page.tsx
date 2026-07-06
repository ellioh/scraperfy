"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null);
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setErr("Contraseña incorrecta.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 font-bold text-xl mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />Scraperfy Admin
          </div>
          <p className="text-sm text-gray-500">Panel de administración</p>
        </div>
        <form onSubmit={submit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Contraseña</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} autoFocus required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          {err && <p className="text-xs text-red-400">{err}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-60 transition-colors">
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
