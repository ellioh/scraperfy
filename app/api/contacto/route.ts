import { NextRequest, NextResponse } from "next/server";
import { saveSolicitud } from "@/lib/data";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nombre, email, empresa, url_objetivo, frecuencia, formato, descripcion, plan } = body;
  if (!nombre || !email || !url_objetivo || !frecuencia || !formato) {
    return NextResponse.json({ ok: false, msg: "Faltan campos requeridos" }, { status: 400 });
  }
  const s = saveSolicitud({ nombre, email, empresa: empresa || "", url_objetivo, frecuencia, formato, descripcion: descripcion || "", plan: plan || "" });
  return NextResponse.json({ ok: true, id: s.id });
}
