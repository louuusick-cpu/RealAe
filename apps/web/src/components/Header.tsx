"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { dict } from "@/lib/dict";

export function Header({ lang }: { lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const t = dict[lang as keyof typeof dict] || dict.ru;

  const cities = [
    { name: lang === 'en' ? "Phuket" : "Пхукет", slug: "phuket" },
    { name: lang === 'en' ? "Bangkok" : "Бангкок", slug: "bangkok" },
    { name: lang === 'en' ? "Dubai" : "Дубай", slug: "dubai" },
    { name: lang === 'en' ? "London" : "Лондон", slug: "london" },
    { name: lang === 'en' ? "Tbilisi" : "Тбилиси", slug: "tbilisi" },
    { name: lang === 'en' ? "Bali" : "Бали", slug: "bali" }
  ];

  const toggleLang = () => {
    const newLang = lang === 'ru' ? 'en' : 'ru';
    document.cookie = `lang=${newLang}; path=/; max-age=${60 * 60 * 24 * 30}`;
    router.refresh();
  };

  return (
    <header className="border-b border-[#1a1a1a] sticky top-0 bg-[#050505] z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-14 h-14 md:w-16 md:h-16 mix-blend-screen">
            <Image src="/logo.jpg" alt="RAW" fill className="object-contain" />
          </div>
          <span className="text-base md:text-xl tracking-[0.2em] uppercase font-light hidden sm:block">
            Real Aesthetics
          </span>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/models" className="text-sm uppercase tracking-widest hover:text-text-dim transition-colors hidden md:block">
            {t.models}
          </Link>
          
          <Link href="/about" className="text-sm uppercase tracking-widest hover:text-text-dim transition-colors hidden md:block">
            {t.about}
          </Link>

          <button onClick={toggleLang} className="flex items-center gap-1 text-sm uppercase tracking-widest hover:text-text-dim transition-colors">
            <Globe className="w-4 h-4" /> {lang === 'ru' ? 'EN' : 'RU'}
          </button>
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-text-dim transition-colors"
          >
            {t.cities} {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#050505] border-b border-[#1a1a1a] shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {cities.map((c) => (
              <Link 
                key={c.slug} 
                href={`/models?city=${encodeURIComponent(c.slug)}`} 
                onClick={() => setIsOpen(false)} 
                className="text-lg font-light hover:text-text-dim transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
