import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomeEN() {
  const models = await prisma.model.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {models.map((model, idx) => {
          let photos = [];
          try { photos = JSON.parse(model.photos); } catch(e) { photos = (model.photos as string || "").split(",").map(s=>s.trim()); }
          
          const isFree = model.status.toLowerCase().includes("свободна");
          const statusColor = isFree ? "text-green-500" : "text-red-500";
          const statusText = isFree ? "Available" : "Busy";

          return (
            <Link key={model.id} href={`/en/models/${model.slug}`} className="group flex flex-row md:flex-col gap-3 md:gap-0 bg-[#0a0a0a] md:bg-transparent border border-[#1a1a1a] md:border-none p-3 md:p-0 rounded-sm md:rounded-none">
              <div className="relative w-28 sm:w-36 md:w-full aspect-[3/4] bg-bg-card shrink-0 overflow-hidden md:mb-3">
                <Image 
                  src={photos[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800"} 
                  alt={model.name} 
                  fill priority={idx < 4} quality={85}
                  sizes="(max-width: 768px) 120px, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute top-2 right-2 px-2.5 py-1 bg-[#151515]/90 rounded-full backdrop-blur text-[9px] md:text-[11px] font-bold uppercase tracking-wider ${statusColor}`}>
                  {statusText}
                </div>
              </div>
              
              <div className="flex flex-col justify-center md:justify-start flex-1 px-1 md:px-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-medium">{model.name}, {model.age}</h3>
                  <div className="text-sm font-medium md:hidden">{model.price}</div>
                </div>
                <p className="text-[11px] md:text-xs text-text-dim mt-1">{model.height} cm · {model.nationality}</p>
                <p className="text-[11px] md:text-xs text-text-dim mt-1">City: {model.city}</p>
                <div className="hidden md:block text-sm font-medium mt-1">{model.price}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
