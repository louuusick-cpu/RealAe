"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ModelCard({ model, lang }: { model: any, lang: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const media = useMemo(() => {
    let urls: string[] = [];
    if (!model.photos) return [];
    
    try {
      const parsed = JSON.parse(model.photos);
      if (Array.isArray(parsed)) urls = parsed.filter((u: any) => typeof u === 'string' && u.length > 0);
    } catch(e) {
      urls = model.photos.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    
    return [
      ...urls.map((url: string) => ({ type: "photo" as const, url })),
      ...(model.video ? [{ type: "video" as const, url: model.video }] : [])
    ];
  }, [model.photos, model.video]);

  const isFree = model.status.toLowerCase().includes("свободна") || model.status.toLowerCase().includes("available");
  const hasMultiple = media.length > 1;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const newIndex = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setActiveIndex(newIndex % Math.max(1, media.length));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current || !hasMultiple) return;
    const width = scrollRef.current.clientWidth;
    let newIndex = activeIndex + (direction === 'left' ? -1 : 1);
    
    if (newIndex < 0) newIndex = media.length - 1;
    if (newIndex >= media.length) newIndex = 0;
    
    scrollRef.current.scrollTo({ left: newIndex * width, behavior: 'smooth' });
    setActiveIndex(newIndex);
  };

  if (media.length === 0) return null;

  return (
    <div className="group flex flex-row md:flex-col gap-3 md:gap-0 bg-[#0a0a0a] md:bg-transparent border border-[#1a1a1a] md:border-none p-3 md:p-0 rounded-sm md:rounded-none">
      
      {/* Уникальный класс hide-swipe-scroll вместо scrollbar-hide */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        onClick={() => window.location.href = `/models/${model.slug}`}
        className="relative w-32 sm:w-36 md:w-full aspect-[3/4] bg-bg-card shrink-0 overflow-x-auto snap-x snap-mandatory hide-swipe-scroll flex cursor-pointer"
      >
        {media.map((m, i) => (
          <div key={i} className="w-full h-full shrink-0 snap-center relative">
            {m.type === "video" ? (
              <video src={m.url} muted autoPlay loop playsInline className="w-full h-full object-cover pointer-events-none" />
            ) : (
              <Image 
                src={m.url} 
                alt={model.name} 
                fill 
                sizes="(max-width: 768px) 128px, 25vw" 
                className="object-cover pointer-events-none select-none" 
                draggable={false}
              />
            )}
          </div>
        ))}

        <button 
          onClick={(e) => { e.stopPropagation(); scroll('left'); }}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm ${!hasMultiple ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); scroll('right'); }}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm ${!hasMultiple ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {hasMultiple && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {media.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all ${activeIndex === idx ? "bg-white w-3" : "bg-white/40 w-1.5"}`} />
            ))}
          </div>
        )}

        <div className={`absolute top-2 right-2 px-2.5 py-1 bg-[#151515]/90 rounded-full backdrop-blur text-[9px] md:text-[11px] font-bold uppercase tracking-wider z-10 ${isFree ? "text-green-500" : "text-red-500"}`}>
          {isFree ? (lang === 'en' ? "Available" : "Свободна") : (lang === 'en' ? "Busy" : "Занята")}
        </div>
      </div>
      
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
