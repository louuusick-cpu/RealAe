import { prisma } from "@/lib/prisma";
import { CatalogClientEN } from "@/components/CatalogClientEN";

export const dynamic = "force-dynamic";

export default async function CatalogPageEN() {
  const models = await prisma.model.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <CatalogClientEN initialModels={models} />
    </main>
  );
}
