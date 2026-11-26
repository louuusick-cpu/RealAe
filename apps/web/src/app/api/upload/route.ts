import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "Нет файла" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Папка для загрузок
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // Безопасное имя файла
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${Date.now()}-${cleanName}`;
    const filePath = path.join(uploadDir, filename);
    
    await writeFile(filePath, buffer);

    // Возвращаем локальный URL
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
