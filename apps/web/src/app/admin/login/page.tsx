"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pass = formData.get("password");

    fetch(`/api/admin/check?pass=${pass}`).then(res => {
      if (res.ok) {
        // Ставим куки ТОЛЬКО если пароль верный
        document.cookie = `admin_auth=${pass}; path=/; max-age=${60 * 60 * 24 * 7}`;
        // Кидаем на скрытый путь
        router.push(`/my-super-secret-path`); 
        router.refresh();
      } else {
        setError(true);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-bg-card border border-line p-8">
        <h1 className="text-xl font-light mb-6">Вход в панель</h1>
        <input 
          type="password" 
          name="password" 
          placeholder="Секретный пароль" 
          required 
          className="w-full h-12 px-4 bg-bg border border-line text-text outline-none focus:border-text mb-4" 
        />
        {error && <p className="text-busy text-xs mb-4">Неверный пароль</p>}
        <button type="submit" className="w-full h-12 bg-text text-bg text-sm font-medium hover:bg-white transition-colors">
          Войти
        </button>
      </form>
    </div>
  );
}
