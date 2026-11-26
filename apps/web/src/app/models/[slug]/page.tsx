import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { TelegramIcon, WhatsAppIcon } from "@/components/Icons";
import { LikeButton } from "@/components/LikeButton";
import { cookies } from "next/headers";
import { dict, translateCity, translateNat, translateService } from "@/lib/dict";

export const dynamic = "force-dynamic";

export default async function ModelProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";
  const t = dict[lang as keyof typeof dict] || dict.ru;

  const model = await prisma.model.findUnique({ where: { slug } });
  if (!model) notFound();

  await prisma.model.update({ where: { id: model.id }, data: { views: { increment: 1 } } });

  let photos = [];
  let services = [];
  try { photos = JSON.parse(model.photos); } catch(e) { photos = (model.photos as string || "").split(",").map(s=>s.trim()); }
  try { services = JSON.parse(model.services); } catch(e) { services = (model.services as string || "").split(",").map(s=>s.trim()); }

  const formatPrice = (price: string | null) => {
    if (!price) return null;
    if (price.includes("$")) return price;
    return `$${price}`;
  };

  const SERVICE_DESCRIPTIONS: Record<string, string> = {
    "МБР": lang === 'en' ? "Blowjob without condom" : "Минет без резинки",
    "Кунилингус": lang === 'en' ? "Cunnilingus" : "Оральная ласка женщины",
    "С аппартаментами": lang === 'en' ? "Meeting at model's place" : "Встреча на территории модели",
    "Анал": lang === 'en' ? "Anal sex" : "Анальный секс",
    "Свободна ли": lang === 'en' ? "Check current status" : "Уточнить актуальный статус"
  };

  const isFree = model.status.toLowerCase().includes("свободна") || model.status.toLowerCase().includes("available");

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <Link href="/models" className="inline-flex items-center gap-2 text-base md:text-lg text-text-dim hover:text-text mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" /> {t.back}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
        
        <div>
          <Gallery photos={photos} video={model.video} name={model.name} />
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Имя + Возраст + Лайки */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm text-text-dim uppercase tracking-widest">{translateCity(model.city, lang)}</div>
              <div className="flex items-center gap-5">
                <LikeButton modelId={model.id} initialLikes={model.likes} />
                <div className="flex items-center gap-2 text-text">
                  <Eye className="w-6 h-6" />
                  <span className="text-lg font-medium">{model.views + 1}</span>
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-light mb-2">{model.name}, {model.age}</h1>
            <p className={`text-lg font-medium ${isFree ? "text-green-500" : "text-red-500"}`}>
              {isFree ? t.free : t.busy}
            </p>
          </div>

          {/* Кнопки связи: СПЛОШНОЙ ФОН, БЕЛЫЙ ТЕКСТ */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 md:p-6 rounded-sm">
            <h3 className="text-sm uppercase tracking-widest text-text-dim mb-4">{t.contact}</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="https://t.me/your_username" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 h-12 bg-[#229ED9] hover:bg-[#1e8bc0] active:scale-95 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all rounded-sm shadow-[0_4px_14px_rgba(34,158,217,0.3)]"
              >
                <TelegramIcon className="w-5 h-5" /> Telegram
              </a>
              <a 
                href="https://wa.me/1234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 h-12 bg-[#25D366] hover:bg-[#21b858] active:scale-95 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all rounded-sm shadow-[0_4px_14px_rgba(37,211,102,0.3)]"
              >
                <WhatsAppIcon className="w-5 h-5" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Характеристики */}
          <div>
            <h3 className="text-sm md:text-base uppercase tracking-widest text-text mb-4">{t.specs}</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-sm text-center">
                <div className="text-xs text-text-dim mb-1">{t.height}</div>
                <div className="text-base font-medium">{model.height} см</div>
              </div>
              {model.weight && (
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-sm text-center">
                  <div className="text-xs text-text-dim mb-1">{t.weight}</div>
                  <div className="text-base font-medium">{model.weight} кг</div>
                </div>
              )}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-sm text-center">
                <div className="text-xs text-text-dim mb-1">{t.bust}</div>
                <div className="text-base font-medium">{model.bust}</div>
              </div>
            </div>
            <div className="mt-3 bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-sm flex justify-between items-center">
              <span className="text-xs text-text-dim">{t.nat}</span>
              <span className="text-base font-medium">{translateNat(model.nationality, lang)}</span>
            </div>
          </div>

          {/* Услуги */}
          <div>
            <h3 className="text-sm md:text-base uppercase tracking-widest text-text mb-4">{t.services}</h3>
            <div className="flex flex-wrap gap-3">
              {services.map((s: string) => {
                const translated = translateService(s, lang);
                const desc = SERVICE_DESCRIPTIONS[s] || (lang === 'en' ? "Ask manager for details" : "Подробности у менеджера");
                return (
                  <div key={s} className="relative group cursor-help">
                    <span className="text-text text-sm md:text-base border-b border-[#1a1a1a] pb-1">
                      {translated}
                    </span>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-[#151515] border border-[#333] text-xs text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center">
                      {desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Стоимость */}
          <div>
            <h3 className="text-sm md:text-base uppercase tracking-widest text-text mb-4">{t.price}</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 text-center rounded-sm hover:border-[#333] transition-colors">
                <div className="text-xs md:text-sm text-text-dim mb-2 uppercase tracking-wider">{t.h1}</div>
                <div className="text-xl md:text-2xl font-light">{formatPrice(model.price1h)}</div>
              </div>
              {model.price2h && (
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 text-center rounded-sm hover:border-[#333] transition-colors">
                  <div className="text-xs md:text-sm text-text-dim mb-2 uppercase tracking-wider">{t.h2}</div>
                  <div className="text-xl md:text-2xl font-light">{formatPrice(model.price2h)}</div>
                </div>
              )}
              {model.price4h && (
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 text-center rounded-sm hover:border-[#333] transition-colors">
                  <div className="text-xs md:text-sm text-text-dim mb-2 uppercase tracking-wider">{t.h4}</div>
                  <div className="text-xl md:text-2xl font-light">{formatPrice(model.price4h)}</div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
