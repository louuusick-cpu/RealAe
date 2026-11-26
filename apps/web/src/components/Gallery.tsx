"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

export function Gallery({ photos, video, name }: { photos: string[], video?: string | null, name: string }) {
  const allMedia = [
    ...photos.map(url => ({ type: "photo" as const, url })),
    ...(video ? [{ type: "video" as const, url: video }] : [])
  ];
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const newIndex = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setActiveIndex(newIndex);
  };

  const scrollTo = (idx: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  // Синхронизация миниатюр
  useEffect(() => {
    if (!thumbsRef.current || allMedia.length <= 1) return;
    const thumbWidth = thumbsRef.current.children[0]?.clientWidth || 80;
    const gap = 8;
    const containerWidth = thumbsRef.current.clientWidth;
    const thumbCenter = activeIndex * (thumbWidth + gap) + thumbWidth / 2;
    const scrollPos = thumbCenter - containerWidth / 2;
    
    thumbsRef.current.scrollTo({ 
      left: Math.max(0, scrollPos), 
      behavior: 'smooth' 
    });
  }, [activeIndex, allMedia.length]);

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="relative">
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

        {allMedia.length > 1 && (
          <>
            <button 
              onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/70 disabled:opacity-20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </button>
            <button 
              onClick={() => scrollTo(Math.min(allMedia.length - 1, activeIndex + 1))}
              disabled={activeIndex === allMedia.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/70 disabled:opacity-20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </>
        )}
      </div>

      {allMedia.length > 1 && (
        <div 
          ref={thumbsRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {allMedia.map((media, idx) => (
            <button 
              key={idx} 
              onClick={() => scrollTo(idx)}
              className={`relative w-16 md:w-20 shrink-0 aspect-[3/4] border overflow-hidden transition-all ${activeIndex === idx ? "border-white ring-1 ring-white/50" : "border-[#1a1a1a] opacity-50 hover:opacity-100"}`}
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
