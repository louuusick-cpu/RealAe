"use client";

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
