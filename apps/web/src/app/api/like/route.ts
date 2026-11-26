import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

    const updated = await prisma.model.update({
      where: { id },
      data: { likes: { increment: 1 } }
    });

    return NextResponse.json({ likes: updated.likes });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
