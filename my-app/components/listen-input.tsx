"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  audioSrc: string;
  status: "correct" | "wrong" | "none";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const ListenInput = ({
  audioSrc,
  status,
  value,
  onChange,
  disabled,
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (isPlaying) return;
    const audio = new Audio(audioSrc);
    setIsPlaying(true);
    audio.play();
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className="flex flex-col gap-y-5 items-center w-full">
      {/* Bouton lecture audio */}
      <button
        onClick={playAudio}
        disabled={isPlaying || disabled}
        className={cn(
          "flex items-center gap-x-3 px-6 py-4 rounded-2xl border-2 border-b-4 font-bold transition-all",
          "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200",
          !isPlaying && "border-sky-300 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 cursor-pointer",
          isPlaying && "border-sky-200 bg-sky-50 dark:bg-sky-900/10 opacity-80 cursor-default",
          status === "correct" && "border-green-400 bg-green-50 dark:bg-green-900/20",
          status === "wrong" && "border-rose-400 bg-rose-50 dark:bg-rose-900/20",
        )}
        style={{ borderBottomWidth: 4 }}
      >
        <Volume2 className={cn(
          "h-6 w-6 transition-all",
          isPlaying ? "text-sky-400 animate-pulse" : "text-sky-500",
          status === "correct" && "text-green-500",
          status === "wrong" && "text-rose-500",
        )} />
        <span className="text-base">
          {isPlaying ? "En cours..." : "Écouter"}
        </span>
      </button>

      <p className="text-xs text-neutral-400 font-semibold">
        Appuie plusieurs fois si besoin
      </p>

      {/* Zone de saisie */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || status !== "none"}
        placeholder="Écris ce que tu as entendu..."
        rows={3}
        className={cn(
          "w-full resize-none rounded-2xl border-2 border-b-4 px-5 py-4",
          "text-base font-bold text-neutral-700 dark:text-neutral-200",
          "bg-white dark:bg-neutral-900 outline-none transition-all",
          "placeholder:text-neutral-400 dark:placeholder:text-neutral-500 placeholder:font-normal",
          status === "none" &&
            "border-neutral-300 dark:border-neutral-600 focus:border-sky-400 dark:focus:border-sky-500",
          status === "correct" &&
            "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
          status === "wrong" &&
            "border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300",
        )}
      />
    </div>
  );
};