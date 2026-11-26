import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const models = await prisma.model.findMany({ orderBy: { createdAt: "desc" } });
  const secretPath = "my-super-secret-path";

  return (
    <div className="min-h-screen bg-bg p-6 text-text">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-light">Управление моделями</h1>
          <Link 
            href={`/${secretPath}/new`}
            className="h-10 px-4 bg-text text-bg text-sm font-medium flex items-center gap-2 hover:bg-white transition-colors"
          >
            <Plus className="w-4 h-4" /> Добавить
          </Link>
        </div>

        <div className="bg-bg-card border border-line overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-text-dim">
              <tr>
                <th className="p-4 font-normal">Имя</th>
                <th className="p-4 font-normal">Город</th>
                <th className="p-4 font-normal">Статус</th>
                <th className="p-4 font-normal">Действия</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.id} className="border-b border-line/50 hover:bg-white/5">
                  <td className="p-4">{m.name} ({m.age})</td>
                  <td className="p-4">{m.city}</td>
                  <td className="p-4">{m.status}</td>
                  <td className="p-4">
                    <Link href={`/${secretPath}/${m.id}`} className="text-text-dim hover:text-text underline">
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
