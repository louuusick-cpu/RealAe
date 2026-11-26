import { prisma } from "@/lib/prisma";
import { ModelCard } from "@/components/ModelCard";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";
  const models = await prisma.model.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} lang={lang} />
        ))}
      </div>
    </main>
  );
}
