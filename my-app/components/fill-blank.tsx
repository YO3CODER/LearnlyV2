"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { challengeOptions } from "@/db/schema";

type Option = typeof challengeOptions.$inferSelect;

type Props = {
  question: string;
  options: Option[];
  selectedBlanks: (number | null)[];
  onSelectBlank: (blankIndex: number, optionId: number | null) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

const BORDER_COLORS = [
  "border-violet-400",
  "border-sky-400",
  "border-emerald-400",
  "border-amber-400",
  "border-rose-400",
  "border-fuchsia-400",
];

const BG_COLORS = [
  "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300",
  "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300",
  "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
  "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
  "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300",
  "bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300",
];

export const FillBlank = ({
  question,
  options,
  selectedBlanks,
  onSelectBlank,
  status,
  disabled,
}: Props) => {
  const [activeOption, setActiveOption] = useState<number | null>(null);

  const parts = question.split("___");
  const blankCount = parts.length - 1;

  // Index stable de la couleur par option (basé sur l'index dans options[])
  const getOptionColorIndex = (optionId: number) => {
    return options.findIndex((o) => o.id === optionId) % BORDER_COLORS.length;
  };

  const getBlankLabel = (blankIndex: number) => {
    const selectedId = selectedBlanks[blankIndex];
    if (selectedId === null || selectedId === undefined) return null;
    return options.find((o) => o.id === selectedId)?.text ?? null;
  };

  const getBlankOptionId = (blankIndex: number) => selectedBlanks[blankIndex] ?? null;

  // Clic sur une option : la place dans le premier blank vide, ou retire si déjà placée
  const handleOptionClick = (optionId: number) => {
    if (disabled || status !== "none") return;

    // Si l'option est déjà dans un blank → la retirer
    const placedIndex = selectedBlanks.indexOf(optionId);
    if (placedIndex !== -1) {
      onSelectBlank(placedIndex, null);
      return;
    }

    // Trouver le premier blank vide
    const firstEmpty = selectedBlanks.findIndex((b) => b === null);
    if (firstEmpty !== -1) {
      onSelectBlank(firstEmpty, optionId);
    }
  };

  // Clic sur un blank rempli → vide ce blank (remet l'option dans la banque)
  const handleBlankClick = (blankIndex: number) => {
    if (disabled || status !== "none") return;
    if (selectedBlanks[blankIndex] !== null) {
      onSelectBlank(blankIndex, null);
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      {/* Phrase avec les blancs */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-xl font-bold text-neutral-700 dark:text-neutral-200 leading-relaxed">
        {parts.map((part, i) => (
          <span key={i} className="flex flex-wrap items-center gap-x-2">
            {part && <span>{part}</span>}

            {i < blankCount && (() => {
              const optionId = getBlankOptionId(i);
              const label = getBlankLabel(i);
              const colorIdx = optionId !== null ? getOptionColorIndex(optionId) : -1;

              return (
                <button
                  onClick={() => handleBlankClick(i)}
                  disabled={disabled || status !== "none"}
                  className={cn(
                    "min-w-[80px] px-4 py-1.5 rounded-xl border-2 border-b-4 font-extrabold text-base transition-all inline-flex items-center justify-center",
                    // Vide
                    !label && "border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-transparent",
                    // Rempli avec couleur de l'option
                    label && status === "none" && colorIdx !== -1 &&
                      `${BORDER_COLORS[colorIdx]} ${BG_COLORS[colorIdx]} hover:opacity-80 cursor-pointer`,
                    // Correct
                    status === "correct" && label && "border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300",
                    // Wrong
                    status === "wrong" && label && "border-rose-400 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
                  )}
                >
                  {label ?? "　"}
                </button>
              );
            })()}
          </span>
        ))}
      </div>

      {/* Séparateur */}
      <div className="w-full h-px bg-neutral-200 dark:bg-neutral-700" />

      {/* Banque d'options */}
      <div className="flex flex-wrap gap-2">
        {options.map((option, idx) => {
          const isPlaced = selectedBlanks.includes(option.id);
          const colorIdx = idx % BORDER_COLORS.length;

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={disabled || status !== "none"}
              className={cn(
                "px-4 py-2 rounded-xl border-2 border-b-4 font-bold text-sm transition-all",
                // Disponible
                !isPlaced && status === "none" && !disabled && [
                  BORDER_COLORS[colorIdx],
                  BG_COLORS[colorIdx],
                  "hover:translate-y-[1px] hover:border-b-[2px] cursor-pointer",
                ],
                // Placée dans un blank → grisée
                isPlaced && status === "none" && "border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 opacity-50 cursor-pointer",
                // Désactivée
                (disabled || status !== "none") && "opacity-50 cursor-default",
                // Correct
                status === "correct" && !isPlaced && "border-green-400 bg-green-50 text-green-600",
                // Wrong
                status === "wrong" && !isPlaced && "border-rose-400 bg-rose-50 text-rose-600",
              )}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {/* Hint */}
      {selectedBlanks.some((b) => b === null) && status === "none" && (
        <p className="text-xs text-neutral-400 font-semibold text-center">
          Appuyez sur une réponse pour la placer
        </p>
      )}
    </div>
  );
};