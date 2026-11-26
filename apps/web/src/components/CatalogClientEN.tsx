"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function CatalogClientEN({ initialModels }: { initialModels: any[] }) {
  const [filters, setFilters] = useState({ age: "", price: "", bust: "", service: "" });

  const parsedModels = initialModels.map(m => ({
    ...m,
    photosArray: (() => { try { return JSON.parse(m.photos); } catch(e) { return []; } })(),
    servicesArray: (() => { try { return JSON.parse(m.services); } catch(e) { return []; } })()
  }));

  const filteredModels = parsedModels.filter(model => {
    if (filters.age === "18-22" && (model.age < 18 || model.age > 22)) return false;
    if (filters.age === "23-25" && (model.age < 23 || model.age > 25)) return false;
    if (filters.age === "26+" && model.age < 26) return false;

    const priceNum = parseInt(model.price.replace(/[^0-9]/g, ''));
    if (filters.price === "low" && priceNum >= 150) return false;
    if (filters.price === "mid" && (priceNum < 150 || priceNum > 200)) return false;
    if (filters.price === "high" && priceNum <= 200) return false;

    if (filters.bust && model.bust !== filters.bust) return false;
    // Mapping Russian DB services to EN for filtering
    if (filters.service) {
      const dbServiceMap: Record<string, string> = {
        "CIM": "МБР",
        "Cunnilingus": "Кунилингус",
        "Incall": "С аппартаментами",
        "Anal": "Анал"
      };
      if (!model.servicesArray.includes(dbServiceMap[filters.service])) return false;
    }

    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
        <select value={filters.age} onChange={e => setFilters({...filters, age: e.target.value})} className="h-10 px-3 bg-[#0a0a0a] border border-[#1a1a1a] text-xs md:text-sm outline-none rounded-sm">
          <option value="">Age</option>
          <option value="18-22">18 - 22</option>
          <option value="23-25">23 - 25</option>
          <option value="26+">26+</option>
        </select>

        <select value={filters.price} onChange={e => setFilters({...filters, price: e.target.value})} className="h-10 px-3 bg-[#0a0a0a] border border-[#1a1a1a] text-xs md:text-sm outline-none rounded-sm">
          <option value="">Price</option>
          <option value="low">Under $150</option>
          <option value="mid">$150 - $200</option>
          <option value="high">From $200</option>
        </select>

        <select value={filters.bust} onChange={e => setFilters({...filters, bust: e.target.value})} className="h-10 px-3 bg-[#0a0a0a] border border-[#1a1a1a] text-xs md:text-sm outline-none rounded-sm">
          <option value="">Bust</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>

        <select value={filters.service} onChange={e => setFilters({...filters, service: e.target.value})} className="h-10 px-3 bg-[#0a0a0a] border border-[#1a1a1a] text-xs md:text-sm outline-none rounded-sm">
          <option value="">Services</option>
          <option value="CIM">CIM (МБР)</option>
          <option value="Cunnilingus">Cunnilingus</option>
          <option value="Incall">Incall</option>
          <option value="Anal">Anal</option>
        </select>
      </div>

      {filteredModels.length === 0 ? (
        <p className="text-text-dim text-sm py-10">No models found matching your filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredModels.map((model, idx) => {
            const isFree = model.status.toLowerCase().includes("свободна");
            const statusColor = isFree ? "text-green-500" : "text-red-500";
            const statusText = isFree ? "Available" : "Busy";

            return (
              <Link key={model.id} href={`/en/models/${model.slug}`} className="group flex flex-row md:flex-col gap-3 md:gap-0 bg-[#0a0a0a] md:bg-transparent border border-[#1a1a1a] md:border-none p-3 md:p-0 rounded-sm md:rounded-none">
                <div className="relative w-28 sm:w-36 md:w-full aspect-[3/4] bg-bg-card shrink-0 overflow-hidden md:mb-3">
                  <Image src={model.photosArray[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800"} alt={model.name} fill priority={idx < 4} quality={85} sizes="(max-width: 768px) 120px, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className={`absolute top-2 right-2 px-2.5 py-1 bg-[#151515]/90 rounded-full backdrop-blur text-[9px] md:text-[11px] font-bold uppercase tracking-wider ${statusColor}`}>{statusText}</div>
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
      )}
    </div>
  );
}
