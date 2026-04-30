"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { challengeOptions } from "@/db/schema";

type Option = typeof challengeOptions.$inferSelect;

type Props = {
  question: string; // ex: "3x + ___ = 15, donc x = ___"
  options: Option[];
  selectedBlanks: (number | null)[]; // id de l'option sélectionnée pour chaque blank
  onSelectBlank: (blankIndex: number, optionId: number | null) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

export const FillBlank = ({
  question,
  options,
  selectedBlanks,
  onSelectBlank,
  status,
  disabled,
}: Props) => {
  const [activeBlank, setActiveBlank] = useState<number | null>(null);

  // Découpe la question en parties séparées par "___"
  const parts = question.split("___");
  const blankCount = parts.length - 1;

  // Options disponibles pour le blank actif (non utilisées par d'autres blanks)
  const getAvailableOptions = (blankIndex: number) => {
    const usedIds = selectedBlanks
      .filter((_, i) => i !== blankIndex)
      .filter((id) => id !== null) as number[];
    return options.filter((o) => !usedIds.includes(o.id));
  };

  const handleBlankClick = (blankIndex: number) => {
    if (disabled) return;
    if (status !== "none") return;
    setActiveBlank(activeBlank === blankIndex ? null : blankIndex);
  };

  const handleOptionClick = (optionId: number) => {
    if (activeBlank === null) return;
    if (disabled) return;
    if (status !== "none") return;

    // Si on clique sur l'option déjà sélectionnée → désélectionne
    if (selectedBlanks[activeBlank] === optionId) {
      onSelectBlank(activeBlank, null);
    } else {
      onSelectBlank(activeBlank, optionId);
    }
    setActiveBlank(null);
  };

  const getBlankLabel = (blankIndex: number) => {
    const selectedId = selectedBlanks[blankIndex];
    if (selectedId === null || selectedId === undefined) return null;
    return options.find((o) => o.id === selectedId)?.text ?? null;
  };

  return (
    <div className="flex flex-col gap-y-6">
      {/* Phrase avec les blancs */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-xl font-bold text-neutral-700 dark:text-neutral-200 leading-relaxed">
        {parts.map((part, i) => (
          <span key={i} className="flex flex-wrap items-center gap-x-2">
            {/* Texte avant le blank */}
            {part && <span>{part}</span>}

            {/* Blank (sauf après le dernier morceau) */}
            {i < blankCount && (
              <button
                onClick={() => handleBlankClick(i)}
                disabled={disabled || status !== "none"}
                className={cn(
                  "min-w-[80px] px-4 py-1.5 rounded-xl border-b-4 font-extrabold text-base transition-all",
                  "border-2 inline-flex items-center justify-center",
                  // Vide
                  !getBlankLabel(i) && activeBlank !== i &&
                    "border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-transparent",
                  // Vide + actif
                  !getBlankLabel(i) && activeBlank === i &&
                    "border-sky-400 bg-sky-50 dark:bg-sky-900/30 text-sky-400 animate-pulse",
                  // Rempli
                  getBlankLabel(i) && activeBlank !== i && status === "none" &&
                    "border-sky-400 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
                  // Rempli + actif
                  getBlankLabel(i) && activeBlank === i && status === "none" &&
                    "border-sky-500 bg-sky-100 dark:bg-sky-800/50 text-sky-700 dark:text-sky-300 ring-2 ring-sky-300",
                  // Correct
                  status === "correct" &&
                    "border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300",
                  // Wrong
                  status === "wrong" &&
                    "border-rose-400 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
                )}
              >
                {getBlankLabel(i) ?? "　"}
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Séparateur */}
      <div className="w-full h-px bg-neutral-200 dark:bg-neutral-700" />

      {/* Options disponibles */}
      <div className="flex flex-wrap gap-2">
        {(activeBlank !== null
          ? getAvailableOptions(activeBlank)
          : options.filter((o) => !selectedBlanks.includes(o.id))
        ).map((option) => (
          <button
            key={option.id}
            onClick={() => activeBlank !== null && handleOptionClick(option.id)}
            disabled={disabled || status !== "none" || activeBlank === null}
            className={cn(
              "px-4 py-2 rounded-xl border-b-4 font-bold text-sm transition-all",
              "border border-neutral-200 dark:border-neutral-700",
              "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200",
              activeBlank !== null && status === "none" && !disabled &&
                "hover:translate-y-[1px] hover:border-b-[2px] cursor-pointer",
              (activeBlank === null || disabled || status !== "none") &&
                "opacity-50 cursor-default",
            )}
            style={{ borderBottomWidth: 4 }}
          >
            {option.text}
          </button>
        ))}

        {/* Mots déjà placés — cliquables pour revenir dans la banque */}
        {options
          .filter((o) => selectedBlanks.includes(o.id))
          .map((option) => (
            <button
              key={option.id}
              onClick={() => {
                if (disabled || status !== "none") return;
                const blankIndex = selectedBlanks.indexOf(option.id);
                if (blankIndex !== -1) onSelectBlank(blankIndex, null);
              }}
              disabled={disabled || status !== "none"}
              className={cn(
                "px-4 py-2 rounded-xl border-b-4 font-bold text-sm transition-all",
                "border border-sky-200 dark:border-sky-700",
                "bg-sky-50 dark:bg-sky-900/30 text-sky-500 dark:text-sky-300",
                status === "none" && !disabled && "hover:opacity-70 cursor-pointer",
                (disabled || status !== "none") && "cursor-default",
                status === "correct" && "border-green-200 bg-green-50 text-green-500",
                status === "wrong" && "border-rose-200 bg-rose-50 text-rose-500",
              )}
              style={{ borderBottomWidth: 4 }}
            >
              {option.text}
            </button>
          ))}
      </div>

      {/* Hint — quel blank est actif */}
      {activeBlank !== null && status === "none" && (
        <p className="text-xs text-sky-500 font-semibold text-center animate-pulse">
          Choisissez une réponse pour le blanc {activeBlank + 1}
        </p>
      )}
      {activeBlank === null && selectedBlanks.some((b) => b === null) && status === "none" && (
        <p className="text-xs text-neutral-400 font-semibold text-center">
          Appuyez sur un blanc pour le remplir
        </p>
      )}
    </div>
  );
};