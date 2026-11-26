"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ModelCard } from "./ModelCard";
import { translateService } from "@/lib/dict";

export function CatalogClient({ initialModels, lang }: { initialModels: any[], lang: string }) {
  const [filters, setFilters] = useState({ age: "", price: "", bust: "", service: "" });

  const parsedModels = initialModels.map(m => ({
    ...m,
    servicesArray: (() => { try { return JSON.parse(m.services); } catch(e) { return []; } })()
  }));

  const filteredModels = parsedModels.filter(model => {
    if (filters.age === "18-22" && (model.age < 18 || model.age > 22)) return false;
    if (filters.age === "23-25" && (model.age < 23 || model.age > 25)) return false;
    if (filters.age === "26+" && model.age < 26) return false;

    const priceNum = parseInt((model.price1h || "").replace(/[^0-9]/g, ''));
    if (filters.price === "low" && priceNum >= 150) return false;
    if (filters.price === "mid" && (priceNum < 150 || priceNum > 200)) return false;
    if (filters.price === "high" && priceNum <= 200) return false;

    if (filters.bust && model.bust !== filters.bust) return false;
    if (filters.service && !model.servicesArray.includes(filters.service)) return false;

    return true;
  });

  const t = {
    age: lang === 'en' ? "Age" : "Возраст",
    price: lang === 'en' ? "Price" : "Цена",
    bust: lang === 'en' ? "Bust" : "Грудь",
    services: lang === 'en' ? "Services" : "Услуги",
    none: lang === 'en' ? "Nothing found" : "Ничего не найдено",
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
        <div className="relative">
          <select value={filters.age} onChange={e => setFilters({...filters, age: e.target.value})} className="appearance-none h-10 pl-3 pr-8 bg-[#0a0a0a] border border-[#1a1a1a] text-xs md:text-sm outline-none rounded-sm cursor-pointer hover:border-[#333] transition-colors">
            <option value="">{t.age}</option>
            <option value="18-22">18 - 22</option>
            <option value="23-25">23 - 25</option>
            <option value="26+">26+</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
        </div>

        <div className="relative">
          <select value={filters.price} onChange={e => setFilters({...filters, price: e.target.value})} className="appearance-none h-10 pl-3 pr-8 bg-[#0a0a0a] border border-[#1a1a1a] text-xs md:text-sm outline-none rounded-sm cursor-pointer hover:border-[#333] transition-colors">
            <option value="">{t.price}</option>
            <option value="low">{lang === 'en' ? "Under $150" : "До $150"}</option>
            <option value="mid">$150 - $200</option>
            <option value="high">{lang === 'en' ? "From $200" : "От $200"}</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
        </div>

        <div className="relative">
          <select value={filters.bust} onChange={e => setFilters({...filters, bust: e.target.value})} className="appearance-none h-10 pl-3 pr-8 bg-[#0a0a0a] border border-[#1a1a1a] text-xs md:text-sm outline-none rounded-sm cursor-pointer hover:border-[#333] transition-colors">
            <option value="">{t.bust}</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
        </div>

        <div className="relative">
          <select value={filters.service} onChange={e => setFilters({...filters, service: e.target.value})} className="appearance-none h-10 pl-3 pr-8 bg-[#0a0a0a] border border-[#1a1a1a] text-xs md:text-sm outline-none rounded-sm cursor-pointer hover:border-[#333] transition-colors">
            <option value="">{t.services}</option>
            <option value="МБР">{translateService("МБР", lang)}</option>
            <option value="Кунилингус">{translateService("Кунилингус", lang)}</option>
            <option value="С аппартаментами">{translateService("С аппартаментами", lang)}</option>
            <option value="Анал">{translateService("Анал", lang)}</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
        </div>
      </div>

      {filteredModels.length === 0 ? (
        <p className="text-text-dim text-sm py-10">{t.none}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
