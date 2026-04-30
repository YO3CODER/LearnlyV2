"use client";

import { cn } from "@/lib/utils";
import { challengeOptions, challenges } from "@/db/schema";

import { Card } from "./card";
import { WordBank } from "@/components/word-bank";
import { FillBlank } from "@/components/fill-blank";
import { TranslateInput } from "@/components/translate-input";
import { Match } from "@/components/match";
import { ListenInput } from "@/components/listen-input";

type Props = {
  options: typeof challengeOptions.$inferSelect[];
  onSelect: (id: number) => void;
  // WORD_BANK
  onWordBankSelect?: (id: number) => void;
  onWordBankRemove?: (id: number) => void;
  wordBankSelectedIds?: number[];
  // FILL_BLANK
  onFillBlankSelect?: (blankIndex: number, optionId: number | null) => void;
  fillBlankSelectedBlanks?: (number | null)[];
  // TRANSLATE
  translateValue?: string;
  onTranslateChange?: (value: string) => void;
  // MATCH
  onMatch?: (pairs: [number, number][]) => void;
  matchPairs?: [number, number][];
  // LISTEN
  listenValue?: string;
  onListenChange?: (value: string) => void;
  listenAudioSrc?: string;
  // Common
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: typeof challenges.$inferSelect["type"];
  question?: string;
};

export const Challenge = ({
  options,
  onSelect,
  onWordBankSelect,
  onWordBankRemove,
  wordBankSelectedIds = [],
  onFillBlankSelect,
  fillBlankSelectedBlanks = [],
  translateValue = "",
  onTranslateChange,
  onMatch,
  matchPairs = [],
  listenValue = "",
  onListenChange,
  listenAudioSrc = "",
  status,
  selectedOption,
  disabled,
  type,
  question = "",
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

  if (type === "FILL_BLANK") {
    const blankCount = (question.match(/___/g) ?? []).length;
    const blanks =
      fillBlankSelectedBlanks.length === blankCount
        ? fillBlankSelectedBlanks
        : Array(blankCount).fill(null);
    return (
      <FillBlank
        question={question}
        options={options}
        selectedBlanks={blanks}
        onSelectBlank={onFillBlankSelect ?? (() => {})}
        status={status}
        disabled={disabled}
      />
    );
  }

  if (type === "TRANSLATE") {
    return (
      <TranslateInput
        status={status}
        value={translateValue}
        onChange={onTranslateChange ?? (() => {})}
        disabled={disabled}
      />
    );
  }

  if (type === "MATCH") {
    return (
      <Match
        options={options}
        status={status}
        disabled={disabled}
        onMatch={onMatch ?? (() => {})}
      />
    );
  }

  if (type === "LISTEN") {
    return (
      <ListenInput
        audioSrc={listenAudioSrc}
        status={status}
        value={listenValue}
        onChange={onListenChange ?? (() => {})}
        disabled={disabled}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
      )}
    >
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