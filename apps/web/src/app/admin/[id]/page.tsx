import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ModelForm } from "@/components/AdminForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function saveModel(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const isNew = id === "new";
  
  const photosArray = String(formData.get("photos")).split(",").map(s => s.trim()).filter(Boolean);
  const servicesArray = String(formData.get("services")).split(",").map(s => s.trim()).filter(Boolean);

  const data = {
    slug: String(formData.get("slug")),
    name: String(formData.get("name")),
    age: Number(formData.get("age")),
    height: Number(formData.get("height")),
    weight: formData.get("weight") ? Number(formData.get("weight")) : null,
    city: String(formData.get("city")),
    nationality: String(formData.get("nationality")),
    bust: String(formData.get("bust")),
    price1h: String(formData.get("price1h")),
    price2h: String(formData.get("price2h") || ""),
    price4h: String(formData.get("price4h") || ""),
    status: String(formData.get("status")),
    bio: String(formData.get("bio")),
    services: JSON.stringify(servicesArray),
    photos: JSON.stringify(photosArray),
    video: String(formData.get("video") || ""),
  };

  if (isNew) await prisma.model.create({ data });
  else await prisma.model.update({ where: { id }, data });

  revalidatePath("/");
  revalidatePath("/models");
  redirect(`/my-super-secret-path`);
}

export default async function EditModel({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  
  const model = isNew ? null : await prisma.model.findUnique({ where: { id } });

  if (!isNew && !model) return notFound();

  let safeServices = [];
  let safePhotos = [];
  
  if (model) {
    try { safeServices = JSON.parse(model.services as string); } catch(e) { safeServices = (model.services as string || "").split(",").map(s=>s.trim()); }
    try { safePhotos = JSON.parse(model.photos as string); } catch(e) { safePhotos = (model.photos as string || "").split(",").map(s=>s.trim()); }
  }

  return (
    <div className="min-h-screen bg-bg p-6 text-text">
      <div className="max-w-2xl mx-auto bg-bg-card border border-line p-6 md:p-8">
        <h1 className="text-2xl font-light mb-6">{isNew ? "Новая модель" : "Редактирование"}</h1>
        <ModelForm 
          model={model ? { ...model, services: safeServices, photos: safePhotos } : null} 
          adminPath="my-super-secret-path"
          saveAction={saveModel}
        />
      </div>
    </div>
  );
}
