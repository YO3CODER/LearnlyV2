"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  value: number;
  variant: "points" | "hearts";
};

export const ResultCard = ({ value, variant }: Props) => {
  const imageSrc = variant === "hearts" ? "/heart.svg" : "/points.svg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border-2 w-full overflow-hidden",
        variant === "points" && "bg-orange-400 border-orange-400",
        variant === "hearts" && "bg-rose-500 border-rose-500",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={cn(
          "p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-xs",
          variant === "hearts" && "bg-rose-500",
          variant === "points" && "bg-orange-400"
        )}
      >
        {variant === "hearts" ? "Hearts Left" : "Total XP"}
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
        className={cn(
          "rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg",
          variant === "hearts" && "text-rose-500",
          variant === "points" && "text-orange-400"
        )}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
        >
          <Image
            alt="Icon"
            src={imageSrc}
            height={30}
            width={30}
            className="mr-1.5"
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {value}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};