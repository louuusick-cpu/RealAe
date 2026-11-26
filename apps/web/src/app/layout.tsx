import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { TelegramIcon, WhatsAppIcon } from "@/components/Icons";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Real Aesthetics",
  description: "Curated companion agency. Point-to-point service.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "ru";

  return (
    <html lang={lang}>
      <body className="bg-[#050505] text-text flex flex-col min-h-screen">
        <Header lang={lang} />
        
        <main className="flex-grow">
          {children}
        </main>

        <footer className="border-t border-[#1a1a1a] mt-16 py-8 md:py-12 text-sm text-text-dim bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 mix-blend-screen">
                  <Image src="/logo.jpg" alt="RAW" fill className="object-contain" />
                </div>
                <span className="text-xs md:text-sm">© {new Date().getFullYear()} Real Aesthetics. 18+</span>
              </div>
              <div className="flex gap-4 md:gap-6 items-center">
                <a href="https://t.me/your_username" target="_blank" className="hover:opacity-80 transition-opacity">
                  <TelegramIcon className="w-5 h-5" />
                </a>
                <a href="https://wa.me/1234567890" target="_blank" className="hover:opacity-80 transition-opacity">
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
                <Link href="/join" className="text-xs md:text-sm hover:text-text ml-2">{lang === 'en' ? 'For Models' : 'Для моделей'}</Link>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#1a1a1a] flex flex-wrap gap-4 md:gap-6 text-xs">
              <Link href="/terms" className="hover:text-text transition-colors">{lang === 'en' ? 'Terms of Service' : 'Условия пользования'}</Link>
              <Link href="/privacy" className="hover:text-text transition-colors">{lang === 'en' ? 'Privacy Policy' : 'Политика конфиденциальности'}</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
