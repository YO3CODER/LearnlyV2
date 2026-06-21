"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  audioSrc: string;
  status: "correct" | "wrong" | "none";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const GIFS = ["/1.gif", "/2.gif", "/3.gif", "/4.gif"];

// Couleurs qui défilent en arc-en-ciel sur la bordure de la textarea
const BORDER_COLORS = [
  "#38bdf8", // sky
  "#818cf8", // indigo
  "#a78bfa", // violet
  "#f472b6", // pink
  "#fb923c", // orange
  "#34d399", // emerald
];

export const ListenInput = ({
  audioSrc,
  status,
  value,
  onChange,
  disabled,
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGif, setCurrentGif] = useState("/3.gif");
  const [gifVisible, setGifVisible] = useState(true);
  const [colorIndex, setColorIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const gifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colorTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rotation aléatoire du GIF toutes les 4–8 secondes
  useEffect(() => {
    const schedule = () => {
      const delay = 4000 + Math.random() * 4000;
      gifTimerRef.current = setTimeout(() => {
        // Fade out
        setGifVisible(false);
        setTimeout(() => {
          // Choisir un GIF différent du courant
          setCurrentGif((prev) => {
            const others = GIFS.filter((g) => g !== prev);
            return others[Math.floor(Math.random() * others.length)];
          });
          setGifVisible(true);
          schedule();
        }, 300);
      }, delay);
    };
    schedule();
    return () => {
      if (gifTimerRef.current) clearTimeout(gifTimerRef.current);
    };
  }, []);

  // Animation couleur de bordure quand focus sur la textarea
  useEffect(() => {
    if (isFocused && status === "none") {
      colorTimerRef.current = setInterval(() => {
        setColorIndex((i) => (i + 1) % BORDER_COLORS.length);
      }, 600);
    } else {
      if (colorTimerRef.current) clearInterval(colorTimerRef.current);
    }
    return () => {
      if (colorTimerRef.current) clearInterval(colorTimerRef.current);
    };
  }, [isFocused, status]);

  const playAudio = () => {
    if (isPlaying) return;
    const audio = new Audio(audioSrc);
    setIsPlaying(true);
    audio.play();
    audio.onended = () => setIsPlaying(false);
  };

  // Bordure dynamique de la textarea
  const textareaBorderStyle: React.CSSProperties =
    isFocused && status === "none"
      ? {
          borderColor: BORDER_COLORS[colorIndex],
          borderBottomWidth: 4,
          transition: "border-color 0.4s ease",
          boxShadow: `0 0 0 3px ${BORDER_COLORS[colorIndex]}22`,
        }
      : { borderBottomWidth: 4 };

  return (
    <div className="flex flex-col gap-y-5 items-center w-full">
      {/* Bouton lecture audio + GIF mascotte */}
      <div className="flex items-center gap-x-4">
        {/* Mascotte GIF avec transition fade */}
        <img
          src={currentGif}
          alt="mascotte"
          className="h-16 w-16 object-contain"
          style={{
            opacity: gifVisible ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        <button
          onClick={playAudio}
          disabled={isPlaying || disabled}
          className={cn(
            "flex items-center gap-x-3 px-6 py-4 rounded-2xl border-2 border-b-4 font-bold transition-all duration-200",
            "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200",
            !isPlaying &&
              "border-sky-300 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 cursor-pointer hover:scale-105 active:scale-95",
            isPlaying &&
              "border-sky-200 bg-sky-50 dark:bg-sky-900/10 opacity-80 cursor-default",
            status === "correct" &&
              "border-green-400 bg-green-50 dark:bg-green-900/20",
            status === "wrong" &&
              "border-rose-400 bg-rose-50 dark:bg-rose-900/20",
          )}
          style={{ borderBottomWidth: 4 }}
        >
          <Volume2
            className={cn(
              "h-6 w-6 transition-all",
              isPlaying ? "text-sky-400 animate-pulse" : "text-sky-500",
              status === "correct" && "text-green-500",
              status === "wrong" && "text-rose-500",
            )}
          />
          <span className="text-base">
            {isPlaying ? "En cours..." : "Écouter"}
          </span>
        </button>
      </div>

      <p className="text-xs text-neutral-400 font-semibold animate-pulse">
        Appuie plusieurs fois si besoin
      </p>

      {/* Zone de saisie avec bordure animée */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || status !== "none"}
        placeholder="Écris ce que tu as entendu..."
        rows={3}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "w-full resize-none rounded-2xl border-2 px-5 py-4",
          "text-base font-bold text-neutral-700 dark:text-neutral-200",
          "bg-white dark:bg-neutral-900 outline-none",
          "placeholder:text-neutral-400 dark:placeholder:text-neutral-500 placeholder:font-normal",
          status === "none" && "border-neutral-300 dark:border-neutral-600",
          status === "correct" &&
            "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
          status === "wrong" &&
            "border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300",
        )}
        style={textareaBorderStyle}
      />
    </div>
  );
};