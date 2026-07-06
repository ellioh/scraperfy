import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const token = generateToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("scraperfy_admin_token", token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: 60 * 60 * 8, path: "/",
  });
  return res;
}
