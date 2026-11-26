import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { TelegramIcon, WhatsAppIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function ModelProfileEN({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = await prisma.model.findUnique({ where: { slug } });

  if (!model) notFound();

  let photos = [];
  let services = [];
  try { photos = JSON.parse(model.photos); } catch(e) { photos = (model.photos as string || "").split(",").map(s=>s.trim()); }
  try { services = JSON.parse(model.services); } catch(e) { services = (model.services as string || "").split(",").map(s=>s.trim()); }

  const isFree = model.status.toLowerCase().includes("свободна");
  const statusText = isFree ? "Available" : "Busy";
  const statusColor = isFree ? "text-green-500" : "text-red-500";

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20">
      <Link href="/en/models" className="inline-flex items-center gap-2 text-sm text-text-dim hover:text-text mb-6 md:mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
        <Gallery photos={photos} video={model.video} name={model.name} />

        <div className="flex flex-col justify-center">
          <div className="mb-2 text-xs md:text-sm text-text-dim uppercase tracking-widest">{model.city}</div>
          <h1 className="text-4xl md:text-6xl font-light mb-4">{model.name}</h1>
          
          <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 text-xs md:text-sm">
            <span className="px-2 py-1 md:px-3 bg-bg-card border border-line">{model.age} y.o.</span>
            <span className="px-2 py-1 md:px-3 bg-bg-card border border-line">{model.height} cm</span>
            <span className="px-2 py-1 md:px-3 bg-bg-card border border-line">{model.nationality}</span>
            <span className="px-2 py-1 md:px-3 bg-bg-card border border-line">Bust: {model.bust}</span>
            <span className={`px-2 py-1 md:px-3 bg-bg-card border border-line ${statusColor}`}>{statusText}</span>
          </div>

          <p className="text-sm md:text-base text-text-dim leading-relaxed mb-8">{model.bio}</p>

          <div className="border-t border-line py-5 md:py-6 mb-8">
            <h3 className="text-xs md:text-sm uppercase tracking-widest text-text-dim mb-3 md:mb-4">Services</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((s: string) => {
                const enMap: Record<string, string> = {
                  "МБР": "CIM",
                  "Кунилингус": "Cunnilingus",
                  "С аппартаментами": "Incall",
                  "Анал": "Anal",
                  "Свободна ли": "Outcall"
                };
                return (
                  <span key={s} className="px-3 py-1.5 md:px-4 md:py-2 bg-bg-card border border-line text-xs md:text-sm">{enMap[s] || s}</span>
                );
              })}
            </div>
          </div>

          <div className="bg-bg-card border border-line p-5 md:p-6">
            <div className="flex justify-between items-center mb-5 md:mb-6">
              <div>
                <div className="text-xs md:text-sm text-text-dim mb-1">Rate</div>
                <div className="text-xl md:text-2xl font-medium">{model.price} <span className="text-xs md:text-sm text-text-dim">/ hour</span></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://t.me/your_username" target="_blank" className="flex-1 h-12 bg-[#229ED9]/10 hover:bg-[#229ED9] text-[#229ED9] hover:text-white border border-[#229ED9] font-medium text-sm flex items-center justify-center gap-2 transition-all">
                <TelegramIcon className="w-5 h-5" /> Telegram
              </a>
              <a href="https://wa.me/1234567890" target="_blank" className="flex-1 h-12 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366] font-medium text-sm flex items-center justify-center gap-2 transition-all">
                <WhatsAppIcon className="w-5 h-5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
