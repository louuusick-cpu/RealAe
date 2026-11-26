"use client";

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
