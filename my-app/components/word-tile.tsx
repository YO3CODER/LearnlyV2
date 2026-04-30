"use client";

import { cn } from "@/lib/utils";

type Props = {
  text: string;
  onClick: () => void;
  status?: "correct" | "wrong" | "none";
  disabled?: boolean;
  isSelected?: boolean;
};

export const WordTile = ({ text, onClick, status, disabled, isSelected }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 rounded-xl border-b-4 font-bold text-sm transition-all",
        "border border-neutral-200 dark:border-neutral-700",
        "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200",
        "hover:translate-y-[1px] hover:border-b-[2px] active:translate-y-[3px] active:border-b-0",
        !disabled && "cursor-pointer",
        disabled && "opacity-60 cursor-default",
        isSelected && status === "none" && "border-sky-400 dark:border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
        status === "correct" && isSelected && "border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        status === "wrong" && isSelected && "border-rose-400 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
      )}
      style={{ borderBottomWidth: 4 }}
    >
      {text}
    </button>
  );
};