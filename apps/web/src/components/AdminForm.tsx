"use client";
import { useState } from "react";

const AVAILABLE_SERVICES = ["МБР", "Кунилингус", "С аппартаментами", "Анал", "Свободна ли"];

export function ModelForm({ model, adminPath, saveAction }: { model: any, adminPath: string, saveAction: any }) {
  const [photos, setPhotos] = useState<string>(model ? model.photos.join(", ") : "");
  const [selectedServices, setSelectedServices] = useState<string[]>(model ? model.services : []);
  const [video, setVideo] = useState<string>(model ? model.video || "" : "");
  const [isUploading, setIsUploading] = useState(false);

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "video") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        }
      } catch (err) { console.error(err); }
    }

    if (type === "photo") setPhotos(prev => prev ? `${prev}, ${uploadedUrls.join(", ")}` : uploadedUrls.join(", "));
    else setVideo(uploadedUrls[0] || ""); 
    
    setIsUploading(false);
  };

  return (
    <form action={saveAction} className="space-y-4">
      <input type="hidden" name="id" value={model?.id || "new"} />
      <input type="hidden" name="services" value={selectedServices.join(",")} />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-text-dim">Имя</label>
          <input name="name" defaultValue={model?.name} required className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs text-text-dim">Slug (для URL, латиница)</label>
          <input name="slug" defaultValue={model?.slug} required className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs text-text-dim">Возраст</label>
          <input name="age" type="number" defaultValue={model?.age} required className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs text-text-dim">Рост</label>
          <input name="height" type="number" defaultValue={model?.height} required className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs text-text-dim">Вес (кг)</label>
          <input name="weight" type="number" defaultValue={model?.weight} className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs text-text-dim">Грудь</label>
          <input name="bust" defaultValue={model?.bust} required className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-text-dim">Город</label>
          <input name="city" defaultValue={model?.city} required className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs text-text-dim">Национальность</label>
          <input name="nationality" defaultValue={model?.nationality} required className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-text-dim">Цена (1 час)</label>
          <input name="price1h" defaultValue={model?.price1h} required className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs text-text-dim">Цена (2 часа)</label>
          <input name="price2h" defaultValue={model?.price2h} className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs text-text-dim">Цена (4 часа)</label>
          <input name="price4h" defaultValue={model?.price4h} className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-text-dim">Статус</label>
          <select name="status" defaultValue={model?.status || "Свободна"} className="w-full h-10 px-3 bg-bg border border-line text-sm mt-1">
            <option>Свободна</option>
            <option>Занята</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-text-dim mb-2 block">Услуги</label>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_SERVICES.map(service => (
            <label key={service} className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedServices.includes(service)}
                onChange={() => handleServiceToggle(service)}
                className="accent-text"
              />
              {service}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-text-dim">Био</label>
        <textarea name="bio" defaultValue={model?.bio} rows={3} className="w-full p-3 bg-bg border border-line text-sm mt-1" />
      </div>

      <div className="p-4 border border-line bg-bg/50">
        <label className="text-sm font-medium mb-2 block">Фотографии</label>
        <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, "photo")} disabled={isUploading} className="mb-2 text-sm text-text-dim file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-text file:text-bg hover:file:bg-white" />
        {isUploading && <p className="text-xs text-ok mb-2">Загрузка фото...</p>}
        <textarea name="photos" value={photos} onChange={e => setPhotos(e.target.value)} rows={2} required className="w-full p-3 bg-bg border border-line text-xs text-text-dim mt-1" />
      </div>

      <div className="p-4 border border-line bg-bg/50">
        <label className="text-sm font-medium mb-2 block">Видео (необязательно)</label>
        <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, "video")} disabled={isUploading} className="mb-2 text-sm text-text-dim file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-text file:text-bg hover:file:bg-white" />
        <input name="video" value={video} onChange={e => setVideo(e.target.value)} className="w-full h-10 px-3 bg-bg border border-line text-xs text-text-dim mt-1" />
      </div>

      <div className="flex gap-4 pt-4 border-t border-line">
        <button type="submit" disabled={isUploading} className="h-10 px-6 bg-text text-bg font-medium text-sm hover:bg-white disabled:opacity-50">Сохранить</button>
        <a href={`/${adminPath}`} className="h-10 px-6 border border-line flex items-center justify-center text-sm hover:bg-white/5">Отмена</a>
      </div>
    </form>
  );
}
