import { prisma } from "@/lib/prisma";
import { CatalogClient } from "@/components/CatalogClient";
import { cookies } from "next/headers";
import { dict } from "@/lib/dict";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";
  const models = await prisma.model.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <CatalogClient initialModels={models} lang={lang} />
    </main>
  );
}
