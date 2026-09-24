import { NextRequest, NextResponse } from "next/server";
import { getPostById } from "@/lib/blog";
import { isAuthenticated } from "@/lib/auth";

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
