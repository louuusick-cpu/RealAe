import os

print("--- Свайпы + Кнопки связи ---")

files = {
    # 1. Карточка модели: плавный свайп фото на главной
    "apps/web/src/components/ModelCard.tsx": '''"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export function ModelCard({ model, lang }: { model: any, lang: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const photosArray = (() => { try { return JSON.parse(model.photos); } catch(e) { return []; } })();
  const media = [
    ...photosArray.map((url: string) => ({ type: "photo", url })),
    ...(model.video ? [{ type: "video", url: model.video }] : [])
  ];

  const isFree = model.status.toLowerCase().includes("свободна") || model.status.toLowerCase().includes("available");
  const statusColor = isFree ? "text-green-500" : "text-red-500";

  // Обработка скролла (свайпа) для обновления индекса
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(newIndex);
  };

  return (
    <Link href={`/models/${model.slug}`} className="group flex flex-row md:flex-col gap-3 md:gap-0 bg-[#0a0a0a] md:bg-transparent border border-[#1a1a1a] md:border-none p-3 md:p-0 rounded-sm md:rounded-none">
      
      {/* Фото / Свайп */}
      <div className="relative w-32 sm:w-36 md:w-full aspect-[3/4] bg-bg-card shrink-0 overflow-hidden md:mb-3">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {media.map((m, i) => (
            <div key={i} className="w-full h-full shrink-0 snap-center relative">
              {m.type === "video" ? (
                <video src={m.url} muted autoPlay loop playsInline className="w-full h-full object-cover" />
              ) : (
                <Image src={m.url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800"} alt={model.name} fill quality={85} sizes="(max-width: 768px) 128px, 25vw" className="object-cover" />
              )}
            </div>
          ))}
        </div>

        {/* Точки-индикаторы (маленькие, для мобилок) */}
        {media.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {media.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all ${activeIndex === idx ? "bg-white w-3" : "bg-white/40 w-1.5"}`} />
            ))}
          </div>
        )}

        <div className={`absolute top-2 right-2 px-2.5 py-1 bg-[#151515]/90 rounded-full backdrop-blur text-[9px] md:text-[11px] font-bold uppercase tracking-wider ${statusColor}`}>
          {isFree ? (lang === 'en' ? "Available" : "Свободна") : (lang === 'en' ? "Busy" : "Занята")}
        </div>
      </div>
      
      <div className="flex flex-col justify-center md:justify-start flex-1 px-1 md:px-0">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-medium">{model.name}</h3>
          <div className="text-sm font-medium md:hidden">{model.price1h}</div>
        </div>
        <p className="text-[11px] md:text-xs text-text-dim mt-1">{model.height} см · {model.nationality}</p>
        <div className="hidden md:block text-sm font-medium mt-1">{model.price1h}</div>
      </div>
    </Link>
  );
}
''',

    # 2. Галерея профиля: плавный свайп + миниатюры
    "apps/web/src/components/Gallery.tsx": '''"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export function Gallery({ photos, video, name }: { photos: string[], video?: string | null, name: string }) {
  const allMedia = [
    ...photos.map(url => ({ type: "photo" as const, url })),
    ...(video ? [{ type: "video" as const, url: video }] : [])
  ];
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    setActiveIndex(Math.round(scrollLeft / width));
  };

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* Главное окно свайпа */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full aspect-[3/4] overflow-x-auto snap-x snap-mandatory scrollbar-hide border border-[#1a1a1a] bg-bg-card"
      >
        {allMedia.map((media, idx) => (
          <div key={idx} className="w-full h-full shrink-0 snap-center relative">
            {media.type === "video" ? (
              <video src={media.url} controls playsInline className="w-full h-full object-cover" />
            ) : (
              <Image src={media.url} alt={`${name} - ${idx}`} fill priority={idx === 0} className="object-cover" />
            )}
          </div>
        ))}
      </div>

      {/* Миниатюры с прокруткой к нужному слайду */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allMedia.map((media, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: 'smooth' });
                }
              }}
              className={`relative w-16 md:w-20 shrink-0 aspect-[3/4] border overflow-hidden transition-all ${activeIndex === idx ? "border-white" : "border-[#1a1a1a] opacity-50 hover:opacity-100"}`}
            >
              {media.type === "video" ? (
                <>
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" fill="white" />
                  </div>
                  <video src={media.url} className="w-full h-full object-cover" />
                </>
              ) : (
                <Image src={media.url} alt="thumb" fill className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
''',

    # 3. Страница профиля модели: кнопки Telegram/WhatsApp с четким текстом и иконками
    "apps/web/src/app/models/[slug]/page.tsx": '''import Link from "next/link";
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

          {/* Кнопки связи: сплошной фон, белый текст, четкие иконки */}
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
'''
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        print(f"[+] Обновлен: {path}")

print("\n✅ Готово! Свайпы работают, кнопки связи видны четко.")
input("\nНажми Enter, чтобы закрыть окно...")