import Link from "next/link";
import type { Producto } from "@/lib/productos";

// Server component: solo renderiza datos ya leidos de la BD (nunca importa mysql2 aqui).
// Es la unica definicion visual de las tarjetas de servicio/precio: la usan la home y /servicios.

const TIPO_LABEL: Record<Producto["tipo"], string> = {
  unico: "Pago único",
  mensual: "/mes",
  cotizar: "Cotizar",
};

// Clases completas y literales para que Tailwind las detecte.
function columnas(n: number): string {
  if (n <= 1) return "max-w-sm mx-auto";
  if (n === 2) return "sm:grid-cols-2 max-w-3xl mx-auto";
  if (n === 3) return "sm:grid-cols-2 lg:grid-cols-3";
  return "sm:grid-cols-2 lg:grid-cols-4";
}

export default function ProductosGrid({ productos }: { productos: Producto[] }) {
  return (
    <div className={`grid gap-6 ${columnas(productos.length)}`}>
      {productos.map((prod) => (
        <div
          key={prod.id}
          className={`rounded-2xl border flex flex-col ${
            prod.etiqueta === "Más popular"
              ? "border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-900/20"
              : prod.etiqueta === "Enterprise"
              ? "border-cyan-700/50 bg-cyan-950/20"
              : "border-gray-800 bg-gray-900/50"
          } p-7`}
        >
          {prod.etiqueta && (
            <div
              className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                prod.etiqueta === "Más popular" ? "text-emerald-400" : "text-cyan-400"
              }`}
            >
              {prod.etiqueta}
            </div>
          )}
          <h3 className="font-extrabold text-xl text-white mb-2">{prod.nombre}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{prod.descripcion}</p>

          <div className="mb-6">
            {prod.tipo === "cotizar" ? (
              <span className="text-2xl font-extrabold text-white">A cotizar</span>
            ) : (
              <>
                <span className="text-3xl font-extrabold text-white">
                  {prod.moneda} {prod.precio.toLocaleString("es-PE")}
                </span>
                <span className="text-gray-500 text-sm ml-1">{TIPO_LABEL[prod.tipo]}</span>
              </>
            )}
          </div>

          <ul className="space-y-2.5 mb-8">
            {prod.caracteristicas.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                {c}
              </li>
            ))}
          </ul>

          {/* El servicio elegido llega preseleccionado en el formulario de contacto */}
          <Link
            href={`/contacto?plan=${encodeURIComponent(prod.nombre)}`}
            className={`py-2.5 rounded-xl text-sm font-bold text-center transition-colors ${
              prod.etiqueta === "Más popular"
                ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                : "border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white"
            }`}
          >
            {prod.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
