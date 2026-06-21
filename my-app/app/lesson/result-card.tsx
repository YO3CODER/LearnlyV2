"use client";

import Image from "next/image";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  value: number;
  variant: "points" | "hearts" | "time";
};

const formatTime = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
};

export const ResultCard = ({ value, variant }: Props) => {
  const imageSrc =
    variant === "hearts" ? "/heart.svg" :
    variant === "points" ? "/points.svg" :
    null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border-2 w-full overflow-hidden",
        variant === "points" && "bg-orange-400 border-orange-400",
        variant === "hearts" && "bg-rose-500   border-rose-500",
        variant === "time"   && "bg-sky-500    border-sky-500",
      )}
    >
      {/* ── En-tête coloré ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={cn(
          "p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-xs",
          variant === "hearts" && "bg-rose-500",
          variant === "points" && "bg-orange-400",
          variant === "time"   && "bg-sky-500",
        )}
      >
        {variant === "hearts" && "Hearts Left"}
        {variant === "points" && "Total XP"}
        {variant === "time"   && "Temps"}
      </motion.div>

      {/* ── Corps ── */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
        className={cn(
          "rounded-2xl bg-background dark:bg-background-800 items-center flex justify-center p-6 font-bold text-lg",
          variant === "hearts" && "text-rose-500",
          variant === "points" && "text-orange-400",
          variant === "time"   && "text-sky-500",
        )}
      >
        {/* Icône */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
          className="mr-1.5"
        >
          {imageSrc ? (
            <Image alt="Icon" src={imageSrc} height={30} width={30} />
          ) : (
            <Timer size={30} className="text-sky-500" strokeWidth={2.5} />
          )}
        </motion.div>

        {/* Valeur */}
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {variant === "time" ? formatTime(value) : value}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};