"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export function LikeButton({ modelId, initialLikes }: { modelId: string, initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем при загрузке, лайкал ли уже этот браузер
  useEffect(() => {
    const saved = localStorage.getItem(`liked_${modelId}`);
    if (saved) setIsLiked(true);
  }, [modelId]);

  const handleLike = async () => {
    if (isLiked || isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        body: JSON.stringify({ id: modelId }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setIsLiked(true);
        localStorage.setItem(`liked_${modelId}`, "true");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLike} 
      disabled={isLiked || isLoading}
      className={`flex items-center gap-1.5 transition-colors ${isLiked ? "text-red-500" : "text-text-dim hover:text-red-500"}`}
    >
      <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500" : ""}`} /> 
      <span className="text-lg font-medium">{likes}</span>
    </button>
  );
}
