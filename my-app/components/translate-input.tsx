"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  status: "correct" | "wrong" | "none";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const TranslateInput = ({
  status,
  value,
  onChange,
  disabled,
  placeholder = "Tapez votre réponse...",
}: Props) => {
  return (
    <div className="flex flex-col gap-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || status !== "none"}
        placeholder={placeholder}
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
      {status === "wrong" && (
        <p className="text-xs text-rose-500 font-semibold px-1">
          Vérifie ton orthographe et les accents.
        </p>
      )}
      {status === "none" && (
        <p className="text-xs text-neutral-400 font-semibold px-1">
          La casse et les accents comptent.
        </p>
      )}
    </div>
  );
};