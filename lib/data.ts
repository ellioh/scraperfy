import type { RowDataPacket } from "mysql2/promise";
import { execute, query, toIso } from "@/lib/db";

export interface Solicitud {
  id: string;
  nombre: string;
  email: string;
  empresa: string;
  url_objetivo: string;
  frecuencia: string;
  formato: string;
  descripcion: string;
  plan: string;
  fecha: string;
  leido: boolean;
}

interface SolicitudRow extends RowDataPacket {
  id: string;
  nombre: string;
  email: string;
  empresa: string;
  url_objetivo: string;
  frecuencia: string;
  formato: string;
  descripcion: string;
  plan: string;
  fecha: Date;
  leido: number;
}

function toSolicitud(r: SolicitudRow): Solicitud {
  return {
    id: r.id,
    nombre: r.nombre,
    email: r.email,
    empresa: r.empresa,
    url_objetivo: r.url_objetivo,
    frecuencia: r.frecuencia,
    formato: r.formato,
    descripcion: r.descripcion,
    plan: r.plan,
    fecha: toIso(r.fecha),
    leido: Boolean(r.leido),
  };
}

export async function getSolicitudes(): Promise<Solicitud[]> {
  const rows = await query<SolicitudRow>("SELECT * FROM solicitudes ORDER BY fecha DESC");
  return rows.map(toSolicitud);
}

export async function saveSolicitud(s: Omit<Solicitud, "id" | "fecha" | "leido">): Promise<Solicitud> {
  const nueva: Solicitud = {
    ...s,
    id: Date.now().toString(),
    fecha: new Date().toISOString(),
    leido: false,
  };
  await execute(
    `INSERT INTO solicitudes
       (id, nombre, email, empresa, url_objetivo, frecuencia, formato, descripcion, plan, fecha, leido)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      nueva.id, nueva.nombre, nueva.email, nueva.empresa, nueva.url_objetivo,
      nueva.frecuencia, nueva.formato, nueva.descripcion, nueva.plan, new Date(nueva.fecha),
    ]
  );
  return nueva;
}

export async function marcarLeido(id: string): Promise<void> {
  await execute("UPDATE solicitudes SET leido = 1 WHERE id = ?", [id]);
}
