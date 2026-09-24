import { NextRequest, NextResponse } from "next/server";
import { saveSolicitud } from "@/lib/data";
import { notificarSolicitud } from "@/lib/n8n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function texto(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function esUrlHttp(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, msg: "Solicitud invalida" }, { status: 400 });
  }

  const nombre = texto(body.nombre, 150);
  const email = texto(body.email, 190);
  const url_objetivo = texto(body.url_objetivo, 500);
  const frecuencia = texto(body.frecuencia, 50);
  const formato = texto(body.formato, 50);

  if (!nombre || !email || !url_objetivo || !frecuencia || !formato) {
    return NextResponse.json({ ok: false, msg: "Faltan campos requeridos" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, msg: "Email invalido" }, { status: 400 });
  }
  if (!esUrlHttp(url_objetivo)) {
    return NextResponse.json({ ok: false, msg: "La URL objetivo debe empezar con http:// o https://" }, { status: 400 });
  }

  try {
    const s = await saveSolicitud({
      nombre,
      email,
      empresa: texto(body.empresa, 150),
      url_objetivo,
      frecuencia,
      formato,
      descripcion: texto(body.descripcion, 5000),
      plan: texto(body.plan, 100),
    });
    await notificarSolicitud(s);
    return NextResponse.json({ ok: true, id: s.id });
  } catch (err) {
    console.error("[contacto] error al guardar la solicitud:", err);
    return NextResponse.json({ ok: false, msg: "No se pudo guardar la solicitud, intenta de nuevo" }, { status: 500 });
  }
}
