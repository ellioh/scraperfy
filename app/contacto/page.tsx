import type { Metadata } from "next";
import ContactoForm, { type PlanOpcion } from "@/components/ContactoForm";
import { getProductos, precioTexto } from "@/lib/productos";

export const metadata: Metadata = {
  title: "Contacto y cotización",
  description: "Cuéntanos tu caso de uso y te contactamos en menos de 24h.",
};

export const dynamic = "force-dynamic";

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  // Los servicios del desplegable salen de la BD (admin > Productos), igual que /servicios.
  // Si la BD falla, el formulario sigue usable: el servicio de interes es opcional.
  let planes: PlanOpcion[] = [];
  try {
    planes = (await getProductos()).map((p) => ({
      value: p.nombre,
      label: p.tipo === "cotizar" ? `${p.nombre} (a cotizar)` : `${p.nombre} (${precioTexto(p)})`,
    }));
  } catch (err) {
    console.error("[contacto] no se pudieron cargar los servicios:", err);
  }

  // /contacto?plan=Nombre (desde las tarjetas de servicio) llega preseleccionado
  const { plan } = await searchParams;
  const pedido = Array.isArray(plan) ? plan[0] : plan;
  const planInicial = planes.some((p) => p.value === pedido) ? (pedido as string) : "";

  return <ContactoForm planes={planes} planInicial={planInicial} />;
}
