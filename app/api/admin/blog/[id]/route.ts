import { NextRequest, NextResponse } from "next/server";
import { getPostById } from "@/lib/blog";
import { cookies } from "next/headers";

async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get("scraperfy_admin_token")?.value === process.env.ADMIN_SECRET;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const post = getPostById(id);
  if (!post) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(post);
}
