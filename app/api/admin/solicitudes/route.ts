import { NextRequest, NextResponse } from "next/server";
import { getSolicitudes, marcarLeido } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json(null, { status: 401 });
  return NextResponse.json({ data: getSolicitudes() });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json(null, { status: 401 });
  const { id } = await request.json();
  marcarLeido(id);
  return NextResponse.json({ ok: true });
}
