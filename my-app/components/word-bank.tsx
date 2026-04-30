"use client";

import { cn } from "@/lib/utils";
import { challengeOptions } from "@/db/schema";
import { WordTile } from "./word-tile";

type Option = typeof challengeOptions.$inferSelect;

type Props = {
  options: Option[];
  selectedIds: number[];
  onSelect: (id: number) => void;
  onRemove: (id: number) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

export const WordBank = ({
  options,
  selectedIds,
  onSelect,
  onRemove,
  status,
  disabled,
}: Props) => {
  const selectedOptions = selectedIds
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean) as Option[];

  const availableOptions = options.filter((o) => !selectedIds.includes(o.id));

  return (
    <div className="flex flex-col gap-y-4">
      {/* Zone de construction — mots sélectionnés */}
      <div
        className={cn(
          "min-h-[64px] w-full rounded-2xl border-2 border-dashed p-3",
          "flex flex-wrap gap-2 items-center",
          "transition-colors duration-200",
          status === "none" && "border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/30",
          status === "correct" && "border-green-400 bg-green-50 dark:bg-green-900/20",
          status === "wrong" && "border-rose-400 bg-rose-50 dark:bg-rose-900/20",
        )}
      >
        {selectedOptions.length === 0 && (
          <p className="text-sm text-neutral-400 dark:text-neutral-500 select-none">
            Tap the words to build your answer
          </p>
        )}
        {selectedOptions.map((option) => (
          <WordTile
            key={option.id}
            text={option.text}
            onClick={() => !disabled && onRemove(option.id)}
            status={status}
            disabled={disabled}
            isSelected
          />
        ))}
      </div>

      {/* Séparateur */}
      <div className="w-full h-px bg-neutral-200 dark:bg-neutral-700" />

      {/* Banque de mots disponibles */}
      <div className="flex flex-wrap gap-2">
        {availableOptions.map((option) => (
          <WordTile
            key={option.id}
            text={option.text}
            onClick={() => !disabled && onSelect(option.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};