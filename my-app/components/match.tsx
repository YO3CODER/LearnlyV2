"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { challengeOptions } from "@/db/schema";

type Option = typeof challengeOptions.$inferSelect;

type Props = {
  options: Option[];
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
  onMatch: (pairs: [number, number][]) => void; // [leftId, rightId][]
};

export const Match = ({ options, status, disabled, onMatch }: Props) => {
  // Sépare gauche (questions) / droite (réponses)
  const leftItems = options.filter((o) => !o.correct);
  const rightItems = options.filter((o) => o.correct);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [pairs, setPairs] = useState<[number, number][]>([]);

  const getPairedRight = (leftId: number) =>
    pairs.find(([l]) => l === leftId)?.[1] ?? null;

  const getPairedLeft = (rightId: number) =>
    pairs.find(([, r]) => r === rightId)?.[0] ?? null;

  const isPairedLeft = (id: number) => pairs.some(([l]) => l === id);
  const isPairedRight = (id: number) => pairs.some(([, r]) => r === id);

  const handleLeft = (id: number) => {
    if (disabled || status !== "none") return;
    if (selectedLeft === id) {
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(id);
  };

  const handleRight = (rightId: number) => {
    if (disabled || status !== "none") return;
    if (selectedLeft === null) return;

    const newPairs = pairs
      .filter(([l, r]) => l !== selectedLeft && r !== rightId)
      .concat([[selectedLeft, rightId]]);

    setPairs(newPairs);
    setSelectedLeft(null);
    onMatch(newPairs);
  };

  const removePair = (leftId: number) => {
    if (disabled || status !== "none") return;
    const newPairs = pairs.filter(([l]) => l !== leftId);
    setPairs(newPairs);
    onMatch(newPairs);
  };

  return (
    <div className="flex gap-x-4 w-full">
      {/* Colonne gauche */}
      <div className="flex flex-col gap-y-3 flex-1">
        {leftItems.map((item) => {
          const paired = isPairedLeft(item.id);
          return (
            <button
              key={item.id}
              onClick={() => paired ? removePair(item.id) : handleLeft(item.id)}
              disabled={disabled || status !== "none"}
              className={cn(
                "w-full px-4 py-3 rounded-xl border-2 border-b-4 font-bold text-sm text-left transition-all",
                "bg-white dark:bg-neutral-800",
                // Par défaut
                !paired && selectedLeft !== item.id &&
                  "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200",
                // Sélectionné
                selectedLeft === item.id &&
                  "border-sky-400 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 ring-2 ring-sky-300",
                // Apparié
                paired && status === "none" &&
                  "border-violet-300 dark:border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300",
                // Correct
                status === "correct" &&
                  "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
                // Wrong
                status === "wrong" &&
                  "border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300",
              )}
              style={{ borderBottomWidth: 4 }}
            >
              {item.text}
            </button>
          );
        })}
      </div>

      {/* Connecteurs visuels */}
      <div className="flex flex-col gap-y-3 items-center justify-around w-6">
        {leftItems.map((item) => {
          const paired = isPairedLeft(item.id);
          return (
            <div
              key={item.id}
              className={cn(
                "w-5 h-[3px] rounded-full transition-all",
                paired ? "bg-violet-400" : "bg-neutral-200 dark:bg-neutral-700",
                status === "correct" && paired && "bg-green-400",
                status === "wrong" && paired && "bg-rose-400",
              )}
            />
          );
        })}
      </div>

      {/* Colonne droite */}
      <div className="flex flex-col gap-y-3 flex-1">
        {rightItems.map((item) => {
          const paired = isPairedRight(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleRight(item.id)}
              disabled={disabled || status !== "none" || selectedLeft === null}
              className={cn(
                "w-full px-4 py-3 rounded-xl border-2 border-b-4 font-bold text-sm text-left transition-all",
                "bg-white dark:bg-neutral-800",
                !paired && selectedLeft === null &&
                  "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 opacity-70",
                !paired && selectedLeft !== null && status === "none" && !disabled &&
                  "border-sky-200 dark:border-sky-700 text-neutral-700 dark:text-neutral-200 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 cursor-pointer",
                paired && status === "none" &&
                  "border-violet-300 dark:border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300",
                status === "correct" &&
                  "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
                status === "wrong" &&
                  "border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300",
              )}
              style={{ borderBottomWidth: 4 }}
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};