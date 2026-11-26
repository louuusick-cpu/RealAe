const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialModels = [
  { slug: "mia", name: "Mia", age: 23, height: 170, weight: 55, city: "Пхукет", nationality: "Русская", bust: "3", price1h: "$150", price2h: "$280", price4h: "$500", status: "Свободна", bio: "Модель с опытом в сопровождении.", services: JSON.stringify(["Сопровождение", "Приват", "Выезд"]), photos: JSON.stringify(["https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800&auto=format&fit=crop&grayscale"]), video: null },
  { slug: "elena", name: "Elena", age: 25, height: 175, weight: 58, city: "Дубай", nationality: "Украинка", bust: "2", price1h: "$250", price2h: "$450", price4h: null, status: "Занята", bio: "Элегантная блондинка.", services: JSON.stringify(["Деловой этикет", "Приват"]), photos: JSON.stringify(["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop&grayscale"]), video: null },
  { slug: "sora", name: "Sora", age: 21, height: 165, weight: 50, city: "Бангкок", nationality: "Тайка", bust: "1", price1h: "$120", price2h: null, price4h: null, status: "Свободна", bio: "Юная, но опытная.", services: JSON.stringify(["Прогулки", "Приват"]), photos: JSON.stringify(["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop&grayscale"]), video: null },
  { slug: "lara", name: "Lara", age: 27, height: 172, weight: 60, city: "Бали", nationality: "Латинка", bust: "2", price1h: "$180", price2h: "$320", price4h: null, status: "Свободна", bio: "Спортивная, загорелая.", services: JSON.stringify(["Туры", "Сопровождение"]), photos: JSON.stringify(["https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop&grayscale"]), video: null },
];

async function main() {
  for (const model of initialModels) {
    await prisma.model.upsert({
      where: { slug: model.slug },
      update: {},
      create: model,
    });
  }
  console.log("База заполнена тестовыми моделями с ценами.");
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());