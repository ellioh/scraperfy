import { NextRequest, NextResponse } from "next/server";
import { getProductos, getProductoById, saveProducto, deleteProducto } from "@/lib/productos";
import { cookies } from "next/headers";

async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get("scraperfy_admin_token")?.value === process.env.ADMIN_SECRET;
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(getProductos(false));
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const data = await req.json();
    const producto = saveProducto(data);
    return NextResponse.json(producto, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    const producto = saveProducto(data);
    return NextResponse.json(producto);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    deleteProducto(id);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 400 });
  }
}
