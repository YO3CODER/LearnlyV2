import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  id: number;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  active?: boolean;
};

const BORDER_COLORS = [
  "border-sky-400 border-b-sky-600",
  "border-violet-400 border-b-violet-600",
  "border-emerald-400 border-b-emerald-600",
  "border-rose-400 border-b-rose-600",
  "border-amber-400 border-b-amber-600",
  "border-pink-400 border-b-pink-600",
];

export const Card = ({
  title,
  id,
  imageSrc,
  disabled,
  onClick,
  active,
}: Props) => {
  const borderColor = BORDER_COLORS[id % BORDER_COLORS.length];

  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "relative rounded-xl cursor-pointer p-[3px]",
        "hover:scale-105 hover:-translate-y-1 transition-all duration-200",
        disabled && "pointer-events-none opacity-50"
      )}
      style={
        active
          ? {
              background:
                "conic-gradient(from var(--angle), #38bdf8, #a78bfa, #34d399, #fb7185, #fbbf24, #38bdf8)",
              animation: "spin-border 2s linear infinite",
            }
          : undefined
      }
    >
      {/* Carte intérieure */}
      <div
        className={cn(
          "relative h-full border-2 rounded-[10px] border-b-4 flex flex-col items-center justify-between p-2 pb-4 min-h-[150px] min-w-0 bg-card",
          "active:border-b-2 active:translate-y-0",
          !active && borderColor,
          active && "border-transparent",
        )}
      >
        <div className="min-h-[20px] w-full flex items-center justify-end">
          {active && (
            <div className="rounded-md bg-green-500 flex items-center justify-center p-1 shadow-md">
              <Check className="text-white stroke-[4] h-3 w-3" />
            </div>
          )}
        </div>
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          height={50}
          width={60}
          className={cn(
            "rounded-lg drop-shadow-md border border-border object-cover transition-transform duration-200",
            active && "scale-110"
          )}
        />
        <p className="text-foreground text-center font-bold mt-2 text-sm">
          {title}
        </p>
      </div>
    </div>
  );
};