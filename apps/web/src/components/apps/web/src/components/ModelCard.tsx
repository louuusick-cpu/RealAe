"use client";

import { useState, useRef } from "react";
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

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const newIndex = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setActiveIndex(newIndex);
  };

  return (
    <div className="group flex flex-row md:flex-col gap-3 md:gap-0 bg-[#0a0a0a] md:bg-transparent border border-[#1a1a1a] md:border-none p-3 md:p-0 rounded-sm md:rounded-none">
      
      {/* Зона свайпа - НЕ внутри Link */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        onClick={() => window.location.href = `/models/${model.slug}`}
        className="relative w-32 sm:w-36 md:w-full aspect-[3/4] bg-bg-card shrink-0 overflow-hidden md:mb-3 cursor-pointer snap-x snap-mandatory scrollbar-hide flex"
      >
        {media.map((m, i) => (
          <div key={i} className="w-full h-full shrink-0 snap-center relative">
            {m.type === "video" ? (
              <video src={m.url} muted autoPlay loop playsInline className="w-full h-full object-cover pointer-events-none" />
            ) : (
              <Image 
                src={m.url || "/placeholder.jpg"} 
                alt={model.name} 
                fill 
                quality={85} 
                sizes="(max-width: 768px) 128px, 25vw" 
                className="object-cover pointer-events-none select-none" 
                draggable={false}
              />
            )}
          </div>
        ))}

        {/* Точки */}
        {media.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {media.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all ${activeIndex === idx ? "bg-white w-3" : "bg-white/40 w-1.5"}`} />
            ))}
          </div>
        )}

        {/* Статус */}
        <div className={`absolute top-2 right-2 px-2.5 py-1 bg-[#151515]/90 rounded-full backdrop-blur text-[9px] md:text-[11px] font-bold uppercase tracking-wider z-10 ${isFree ? "text-green-500" : "text-red-500"}`}>
          {isFree ? (lang === 'en' ? "Available" : "Свободна") : (lang === 'en' ? "Busy" : "Занята")}
        </div>
      </div>
      
      {/* Текстовая часть - ссылка */}
      <Link href={`/models/${model.slug}`} className="flex flex-col justify-center md:justify-start flex-1 px-1 md:px-0">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-medium">{model.name}</h3>
          <div className="text-sm font-medium md:hidden">{model.price1h}</div>
        </div>
        <p className="text-[11px] md:text-xs text-text-dim mt-1">{model.height} см · {model.nationality}</p>
        <div className="hidden md:block text-sm font-medium mt-1">{model.price1h}</div>
      </Link>
    </div>
  );
}
