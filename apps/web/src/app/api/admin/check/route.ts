import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pass = req.nextUrl.searchParams.get("pass");
  // Используем env, но если его нет, жестко берем admin123
  const expected = process.env.ADMIN_PASSWORD || "admin123";
  
  if (pass === expected) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
