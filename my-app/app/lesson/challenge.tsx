"use client";

import { cn } from "@/lib/utils";
import { challengeOptions, challenges } from "@/db/schema";

import { Card } from "./card";
import { WordBank } from "../../components/word-bank";

type Props = {
  options: typeof challengeOptions.$inferSelect[];
  onSelect: (id: number) => void;
  onWordBankSelect?: (id: number) => void;
  onWordBankRemove?: (id: number) => void;
  wordBankSelectedIds?: number[];
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: typeof challenges.$inferSelect["type"];
};

export const Challenge = ({
  options,
  onSelect,
  onWordBankSelect,
  onWordBankRemove,
  wordBankSelectedIds = [],
  status,
  selectedOption,
  disabled,
  type,
}: Props) => {
  if (type === "WORD_BANK") {
    return (
      <WordBank
        options={options}
        selectedIds={wordBankSelectedIds}
        onSelect={onWordBankSelect ?? (() => {})}
        onRemove={onWordBankRemove ?? (() => {})}
        status={status}
        disabled={disabled}
      />
    );
  }

  return (
    <div className={cn(
      "grid gap-2",
      type === "ASSIST" && "grid-cols-1",
      type === "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
    )}>
      {options.map((option, i) => (
        <Card
          key={option.id}
          id={option.id}
          text={option.text}
          imageSrc={option.imageSrc}
          shortcut={`${i + 1}`}
          selected={selectedOption === option.id}
          onClick={() => onSelect(option.id)}
          status={status}
          audioSrc={option.audioSrc}
          disabled={disabled}
          type={type}
        />
      ))}
    </div>
  );
};